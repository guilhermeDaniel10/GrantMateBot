import { Kafka, Producer, Consumer } from "kafkajs";
import dotenv from "dotenv";

const dotenvPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: dotenvPath });

class KafkaClient {
  kafka: Kafka;
  producer: Producer;
  consumer: Consumer;

  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_NODE_ID,
      brokers: [process.env.KAFKA_BROKER_ADDRESS!],
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: process.env.KAFKA_GROUP! });
  }

  public async connectProducer(): Promise<Producer> {
    await this.producer.connect();
    return this.producer;
  }

  public async disconnectProducer(): Promise<void> {
    await this.producer.disconnect();
  }

  public async connectConsumer(): Promise<Consumer> {
    await this.consumer.connect();
    return this.consumer;
  }

  public async disconnectConsumer(): Promise<void> {
    await this.consumer.disconnect();
  }

  public getKafkaProducer(): Producer {
    return this.producer;
  }

  public getKafkaConsumer(): Consumer {
    return this.consumer;
  }

  public getKafkaConnection(): Kafka {
    return this.kafka;
  }
}

export default KafkaClient;
