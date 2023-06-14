import Container, { Inject, Service } from "typedi";
import IEmbedService from "../interface_services/IEmbedService";
import { Result } from "../../core/logic/Result";
import { IKafkaStreamResultDTO } from "../../dto/IKafkaStreamResultDTO";
import IKafkaCommunicator from "../../communicators/interface-communicators/IKafkaCommunicator";
import config from "../../config";
import { IGenericInputStreamDTO } from "../../dto/IGenericInputStreamDTO";
import { KAFKA_EMBED_REDO } from "../../constants/KafkaTopicsConstants";
import { StatusCodes } from "http-status-codes";
import IRestCommunicator from "../../communicators/interface-communicators/IRestCommunicator";
import { IResponseDTO } from "../../dto/IResponseDTO";
import { GENERATE_EMBEDDING } from "../../api/endpoints/aibot-endpoint";
import { IStructureOutputDTO } from "../../dto/IStructureOutputDTO";

@Service()
export default class EmbedService implements IEmbedService {
  communicator: IRestCommunicator;

  constructor() {
    this.communicator = Container.get("RestCommunicator");
  }
  async redoEmbedding(): Promise<Result<IStructureOutputDTO>> {
    try {
      const generateEmbeddingResponse = await this.sendEmbeddingGenerateToBot();

      if (generateEmbeddingResponse.success === false) {
        throw Result.fail<IResponseDTO<any>>(
          "Error on file structure request",
          StatusCodes.FORBIDDEN
        );
      }
      return Result.ok<any>(generateEmbeddingResponse.data);
    } catch (e: any) {
      return Result.fail<any>(e.message);
    }
  }

  private sendEmbeddingGenerateToBot(): Promise<IResponseDTO<any>> {
    return this.communicator.sendRequest({
      url: GENERATE_EMBEDDING,
    });
  }
}
