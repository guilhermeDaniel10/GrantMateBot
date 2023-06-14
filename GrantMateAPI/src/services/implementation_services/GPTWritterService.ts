import { Container, Service } from "typedi";
import IGPTWritterService from "../interface_services/IGPTWritterService";
import { Kafka, Producer, Consumer } from "kafkajs";
import dotenv from "dotenv"; 

const dotenvPath = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: dotenvPath });
@Service()
export default class GPTWritterService implements IGPTWritterService {
  constructor() {}
}
