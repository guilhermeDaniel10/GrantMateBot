import { Consumer, Kafka, KafkaMessage, Producer } from "kafkajs";
import Container, { Service } from "typedi";
import { IKafkaFileStreamDTO } from "../../dto/IKafkaFileStreamDTO";
import IKafkaCommunicator from "../interface-communicators/IKafkaCommunicator";
import dotenv from "dotenv";
import { IKafkaStreamResultDTO } from "../../dto/IKafkaStreamResultDTO";
import { IGenericInputStreamDTO } from "../../dto/IGenericInputStreamDTO";

const dotenvPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: dotenvPath });

@Service()
export default class KafkaCommunicator implements IKafkaCommunicator {
  private producer: any; //Producer;
  private kafkaConnection: any; //Kafka;

  consumers: Consumer[] = [];
  messagesRead: any[] = [];

  constructor() {
    //this.producer = Container.get("KafkaProducer");
    //this.kafkaConnection = Container.get("KafkaConnection");
  }

  //------------------------------------------------------------
  // ------------------- GENERIC HANDLING TODO: ADOPT THIS IN EVERY CASE
  // -----------------------------------------------------------
  async sendGenericStreamToAIBotAndConsume(
    genericInputStreamDTO: IGenericInputStreamDTO
  ): Promise<IKafkaStreamResultDTO> {
    const topicToProduce = genericInputStreamDTO.topic;
    const topicToConsume = genericInputStreamDTO.topicToConsume!;
    const createdTopics = await this.createDoubleTopics(
      topicToProduce,
      topicToConsume
    );

    const kafkaProducerMessage = await this.produceGenericKafkaStream(
      this.producer,
      genericInputStreamDTO
    );

    //Disconnected all consumers to make valid requests
    await this.disconnectAllConsumers();

    const consumer = await this.initializeConsumer(topicToConsume);
    let resultStream;
    try {
      resultStream = await this.consumeMessages(consumer, topicToConsume);
      await this.deleteTopic(topicToConsume);
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong with the AI Bot connection.");
    } finally {
      this.consumers.pop();
      await consumer.disconnect();
    }

    if (!resultStream.success) {
      throw new Error("Something went wrong with the AI Bot connection.");
    }

    return resultStream;
  }

  private async disconnectAllConsumers() {
    this.consumers.map(async (consumer: Consumer) => {
      await consumer.disconnect();
    });

    this.consumers = [];
  }

  // -----------------------------------------------------------
  // -------------------- CONSUMER HANDLING --------------------
  // -----------------------------------------------------------
  private async initializeConsumer(topic: string): Promise<Consumer> {
    const consumer = await this.kafkaConnection.consumer({
      groupId: process.env.KAFKA_GROUP!,
    });
    await consumer.connect();
    await consumer.subscribe({ topic: topic, fromBeginning: true });

    return consumer;
  }

  private async consumeMessages(
    consumer: Consumer,
    topic: string
  ): Promise<IKafkaStreamResultDTO> {
    let messageCount = 0; // Initialize a counter for the number of messages received
    let resolvePromise: Function; // Declare a variable for resolving the Promise

    /*const messagePromise = new Promise<void>((resolve) => {
      resolvePromise = resolve;
    });
*/
    this.consumers.push(consumer);
    try {
      const messagePromise = new Promise<IKafkaStreamResultDTO>(
        (resolve, reject) => {
          resolvePromise = resolve;
          setTimeout(
            () =>
              resolvePromise({
                success: false,
                payload: null,
                date: new Date(),
              }),
            120000
          );
        }
      );
      await consumer.run({
        eachMessage: async ({ message }) => {
          messageCount++;
          console.log(
            "RECEIVED MESSAGE",
            message!.value!.toString(),
            message.offset
          );

          if (messageCount > 0) {
            const payloadObj = JSON.parse(message!.value!.toString());
            console.log(payloadObj.success);
            consumer.stop();
            resolvePromise({
              success: payloadObj.success,
              payload: payloadObj.information,
              date: new Date(),
            });
          }
        },
      });
      return await messagePromise;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  }

  // -----------------------------------------------------------
  // -------------------- TOPIC HANDLING -----------------------
  // -----------------------------------------------------------
  private async createTopic(topicName: string): Promise<string> {
    console.log("------------------------------------");
    console.log(topicName);
    const admin = await this.kafkaConnection.admin();
    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: topicName,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });

    await admin.disconnect();
    console.log(`Created topic: ${topicName}`);

    return topicName;
  }

  private async createDoubleTopics(
    topicA: string,
    topicB: string
  ): Promise<string[]> {
    const admin = await this.kafkaConnection.admin();
    await admin.connect();
    await admin.createTopics({
      topics: [
        {
          topic: topicA,
          numPartitions: 1,
          replicationFactor: 1,
        },
        {
          topic: topicB,
          numPartitions: 1,
          replicationFactor: 1,
        },
      ],
    });

    await admin.disconnect();
    console.log(`Created topics: ${topicA} and ${topicB}`);

    return [topicA, topicB];
  }

  async deleteTopic(topicName: string) {
    const admin = this.kafkaConnection.admin();
    await admin.connect();
    await admin.deleteTopics({
      topics: [topicName],
      timeout: 120000,
    });
    await admin.disconnect();
    console.log(`Deleted topic: ${topicName}`);
  }

  delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  // -----------------------------------------------------------
  // -------------------- PRODUCER HANDLING --------------------
  // -----------------------------------------------------------
  async sendGenericStreamToAiBot(
    genericInputStreamDTO: IGenericInputStreamDTO
  ): Promise<IKafkaStreamResultDTO> {
    //const topicName = await this.createTopic(genericInputStreamDTO.topic);
    try {
      await this.produceGenericKafkaStream(
        this.producer,
        genericInputStreamDTO
      );

      return {
        success: true,
        payload: "Stream sent to the AI bot.",
        date: new Date(),
      };
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong with the AI Bot connection.");
    }
  }

  private async produceGenericKafkaStream(
    producer: Producer,
    genericInputStreamDTO: IGenericInputStreamDTO
  ) {
    const topic = genericInputStreamDTO.topic;
    console.log(topic);
    const streamType = genericInputStreamDTO.streamType;
    const payload = genericInputStreamDTO.payload;

    await producer.send({
      topic: topic!,
      messages: [{ value: JSON.stringify({ streamType, payload }) }],
    });

    return (
      "Message Sent with stream type " + streamType + " with topic " + topic
    );
  }

  private async consumeMessage(
    correlation_id: any,
    consumer: Consumer
  ): Promise<IKafkaStreamResultDTO> {
    let resolvePromise: Function; // Declare a variable for resolving the Promise

    this.consumers.push(consumer);
    try {
      const messagePromise = new Promise<IKafkaStreamResultDTO>(
        (resolve, reject) => {
          resolvePromise = resolve;
          setTimeout(() => {
            if (this.messagesRead.length > 0) {
              this.messagesRead.map((msg) => {
                if (msg.correlation_id === correlation_id) {
                  consumer.stop();
                  resolvePromise({
                    success: msg.success,
                    payload: msg.information,
                    correlation_id: msg.correlation_id,
                    date: new Date(),
                  });
                } else {
                  resolvePromise({
                    success: false,
                    payload: null,
                    date: new Date(),
                  });
                }
              });
            } else {
              resolvePromise({
                success: false,
                payload: null,
                date: new Date(),
              });
            }
          }, 120000);
        }
      );
      await consumer.run({
        eachMessage: async ({ message }) => {
          this.messagesRead.map((msg) => {
            if (msg.correlation_id === correlation_id) {
              consumer.stop();
              resolvePromise({
                success: msg.success,
                payload: msg.information,
                correlation_id: msg.correlation_id,
                date: new Date(),
              });
            }
          });
          const payloadObj = JSON.parse(message!.value!.toString());
          if (payloadObj.correlation_id === correlation_id) {
            consumer.stop();
            resolvePromise({
              success: payloadObj.success,
              payload: payloadObj.information,
              correlation_id: payloadObj.correlation_id,
              date: new Date(),
            });
          } else {
            this.messagesRead.push(payloadObj);
          }
        },
      });
      return await messagePromise;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  }

  async produceAndConsume(
    genericInputStreamDTO: IGenericInputStreamDTO
  ): Promise<IKafkaStreamResultDTO> {
    const topicToConsume = genericInputStreamDTO.topicToConsume!;

    const kafkaProducerMessage = await this.produceGenericKafkaStream(
      this.producer,
      genericInputStreamDTO
    );

    //Disconnected all consumers to make valid requests
    await this.disconnectAllConsumers();

    const consumer = await this.initializeConsumer(topicToConsume);
    let resultStream;
    try {
      resultStream = await this.consumeMessage(
        genericInputStreamDTO.payload.correlation_id,
        consumer
      );
      console.log(resultStream);
    } catch (error) {
      console.log(error);
      throw new Error("Something went wrong with the AI Bot connection.");
    } finally {
      this.consumers.pop();
      await consumer.disconnect();
    }

    if (!resultStream.success) {
      throw new Error("Something went wrong with the AI Bot connection.");
    }

    return resultStream;
  }
}
