import { StatusCodes } from "http-status-codes";
import { Inject, Service } from "typedi";
import IKafkaCommunicator from "../../communicators/interface-communicators/IKafkaCommunicator";
import config from "../../config";
import { GPT_2, GPT_3, HUGGING_FACE } from "../../constants/AIModelConstants";
import { GENERATE_TEXT_VIA_PROMPT } from "../../constants/KafkaStreamTypeConstants";
import { Result } from "../../core/logic/Result";
import { IGenericInputStreamDTO } from "../../dto/IGenericInputStreamDTO";
import { IKafkaStreamResultDTO } from "../../dto/IKafkaStreamResultDTO";
import { IPromptDTO } from "../../dto/IPromptDTO";
import IModelManagerService from "../interface_services/IModelManagerService";

@Service()
export default class ModelManagerService implements IModelManagerService {
  constructor() {}

  async generateTextViaPrompt(
    promptDTO: IPromptDTO
  ): Promise<Result<IKafkaStreamResultDTO>> {
    if (promptDTO.model == GPT_2 || promptDTO.model == GPT_3) {
      return this.sendPrompt(promptDTO.streamType, promptDTO);
    }

    return Result.fail<IKafkaStreamResultDTO>(
      "Something went wrong with the AI Bot connection.",
      StatusCodes.CONFLICT
    );
  }

  async sendPrompt(topic: string, promptDTO: IPromptDTO): Promise<Result<any>> {
    return Result.ok<any>({ teste: true });
  }

  async topicSearch(promptDTO: IPromptDTO): Promise<Result<any>> {
    return Result.ok<any>({ teste: true });
  }
}
