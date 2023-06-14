import { Result } from "../../core/logic/Result";
import { IKafkaStreamResultDTO } from "../../dto/IKafkaStreamResultDTO";
import { IPromptDTO } from "../../dto/IPromptDTO";

export default interface IModelManagerService {
  generateTextViaPrompt(promptDTO: IPromptDTO): Promise<Result<IKafkaStreamResultDTO>>;
  topicSearch(promptDTO: IPromptDTO): Promise<Result<IKafkaStreamResultDTO>>;
}
