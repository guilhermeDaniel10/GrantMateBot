import { Kafka } from "kafkajs";
import dotenv from "dotenv";

const dotenvPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: dotenvPath });
const kafka = new Kafka({
  clientId: process.env.KAFKA_NODE_ID,
  brokers: [process.env.KAFKA_BROKER_ADDRESS!],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP! });

const startKafka = async () => {
  await producer.connect();
  //await consumer.connect();

  //await consumer.subscribe({ topic: process.env.KAFKA_GROUP! });

  /*await consumer.run({
    eachMessage: async ({ topic, message }) => {
      // Log the message received from the Python API
      if (message.value) console.log(message.value.toString());
    },
  });*/
};

startKafka().catch(console.error);

export default startKafka;
