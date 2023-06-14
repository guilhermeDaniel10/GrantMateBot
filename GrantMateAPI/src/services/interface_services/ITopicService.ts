import { Result } from "../../core/logic/Result";
import { IDocumentLineDTO } from "../../dto/IDocumentLineDTO";

export default interface ITopicService {
  findTopicByPromptTopKSearch(
    numberOfTopics: number,
    topic: string
  ): Promise<Result<IDocumentLineDTO[]>>;
}
