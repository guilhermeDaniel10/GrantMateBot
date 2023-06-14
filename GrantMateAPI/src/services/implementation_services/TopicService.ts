import Container, { Service } from "typedi";
import ITopicService from "../interface_services/ITopicService";
import { Result } from "../../core/logic/Result";
import { IDocumentLineDTO } from "../../dto/IDocumentLineDTO";

import { IResponseDTO } from "../../dto/IResponseDTO";
import IRestCommunicator from "../../communicators/interface-communicators/IRestCommunicator";
import { FIND_TOPIC_FROM_EMBEDDING } from "../../api/endpoints/aibot-endpoint";
import { StatusCodes } from "http-status-codes";

@Service()
export default class TopicService implements ITopicService {
  communicator: IRestCommunicator;
  constructor() {
    this.communicator = Container.get("RestCommunicator");
  }
  async findTopicByPromptTopKSearch(
    k_number: number,
    text: string
  ): Promise<Result<IDocumentLineDTO[]>> {
    try {
      const topicSearchResponse = await this.requestTopicSearch(k_number, text);

      if (topicSearchResponse.success === false) {
        throw Result.fail<IResponseDTO<IDocumentLineDTO[]>>(
          "Error on topic search request",
          StatusCodes.FORBIDDEN
        );
      }
      return Result.ok<any>(topicSearchResponse.data);
    } catch (e: any) {
      return Result.fail<any>(e.message);
    }
  }

  private requestTopicSearch(
    k_number: number,
    text: string
  ): Promise<IResponseDTO<IDocumentLineDTO>> {
    const payload = {
      text: text,
      k_number: k_number,
    };
    console.log(payload);

    return this.communicator.sendRequest({
      url: FIND_TOPIC_FROM_EMBEDDING,
      data: payload,
    });
  }
}
