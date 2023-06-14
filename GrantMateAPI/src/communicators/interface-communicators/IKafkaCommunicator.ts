import { IGenericInputStreamDTO } from "../../dto/IGenericInputStreamDTO";
import { IKafkaFileStreamDTO } from "../../dto/IKafkaFileStreamDTO";
import { IKafkaStreamResultDTO } from "../../dto/IKafkaStreamResultDTO";

export default interface IKafkaCommunicator {
  /*uploadNewFileStreamToTrain(
    fileStreamDTO: IKafkaFileStreamDTO
  ): Promise<boolean>;*/
  sendGenericStreamToAIBotAndConsume(
    genericInputStreamDTO: IGenericInputStreamDTO
  ): Promise<IKafkaStreamResultDTO>;
  sendGenericStreamToAiBot(
    genericInputStreamDTO: IGenericInputStreamDTO
  ): Promise<IKafkaStreamResultDTO>;

  produceAndConsume(
    genericInputStreamDTO: IGenericInputStreamDTO
  ): Promise<IKafkaStreamResultDTO>;
}
