import { Inject, Service } from "typedi";
import { Result } from "../../../core/logic/Result";
import { IPredefinedMessageDTO } from "../../../dto/messages/IPredefinedMessageDTO";
import IPredefinedMessageReadService from "../../interface_services/message_services/IPredefinedMessageReadService";
import config from "../../../config";
import IPredefinedMessageRepo from "../../../repositories/interface_repositories/IPredefinedMessageRepo";
import { PredefinedMessageNameId } from "../../../domain/message/predefined-message-content/predefinedMessageNameId";
import { PredefinedMessageContent } from "../../../domain/message/predefined-message-content/predefinedMessageContent";
import { PredefinedMessageFromBot } from "../../../domain/message/predefined-message-content/predefinedMessageFromBot";
import { StatusCodes } from "http-status-codes";
import { PredefinedMessage } from "../../../domain/message/predefined-message-content/predefinedMessage";
import { PredefinedMessageMapper } from "../../../mappers/PredefinedMessageMapper";
import { FileUtils } from "../../../utils/FileUtils";
import IDropdownRepo from "../../../repositories/interface_repositories/IDropdownRepo";
import { Dropdown } from "../../../domain/message/dropdown/dropdown";
import { ServiceCall } from "../../../domain/message/service-call/serviceCall";
import IServiceCallRepo from "../../../repositories/interface_repositories/IServiceCallRepo";
import IPredefinedMessageFactory from "../../../factories/interface-factories/IPredefinedMessageFactory";
import DataReader from "./DataReader";

const fs = require("fs");

@Service()
export default class PredefinedMessageReadService
  extends DataReader<IPredefinedMessageDTO>
  implements IPredefinedMessageReadService
{
  constructor(
    @Inject(config.repos.predefinedMessage.name)
    private predefinedMessageRepo: IPredefinedMessageRepo,
    @Inject(config.factories.predefinedMessage.name)
    private predefinedMessageFactory: IPredefinedMessageFactory
  ) {
    super();
  }

  protected async retrieveData(): Promise<Result<IPredefinedMessageDTO[]>> {
    return await this.readPredefinedMessages();
  }

  //Reads the predefined messages from the json file and saves them to the database
  async readPredefinedMessages(): Promise<Result<IPredefinedMessageDTO[]>> {
    try {
      const data = FileUtils.readFileFromPredefinedMessages(
        "predefined_messages.json"
      );
      const predefinedMessages = data.predefinedMessages;
      let predefinedMessageDTOArray: IPredefinedMessageDTO[] = [];

      await Promise.all(
        predefinedMessages.map(
          async (predefinedMessage: IPredefinedMessageDTO) => {
            const predefinedMessageOrError =
              await this.predefinedMessageFactory.createPredefinedMessage(
                predefinedMessage
              );

            if (predefinedMessageOrError.isFailure) {
              throw Result.fail<PredefinedMessage>(
                "Predefined message could not be created",
                StatusCodes.FORBIDDEN
              );
            }

            const predefinedMessageDTOResult = await this.savePredefinedMessage(
              predefinedMessageOrError.getValue()
            );
            predefinedMessageDTOArray.push(predefinedMessageDTOResult);
          }
        )
      );
      return Result.ok<IPredefinedMessageDTO[]>(predefinedMessageDTOArray);
    } catch (e: any) {
      console.error(e);
      throw Result.fail<PredefinedMessage>(
        "Predefined message could not be read",
        StatusCodes.FORBIDDEN
      );
    }
  }

  async findAllPredefinedMessages(): Promise<Result<IPredefinedMessageDTO[]>> {
    try {
      const predefinedMessages = await this.predefinedMessageRepo.findAll();
      if (!predefinedMessages) {
        return Result.fail<IPredefinedMessageDTO[]>(
          "Predefined messages not found",
          StatusCodes.NOT_FOUND
        );
      }
      const predefinedMessageDTOArray: IPredefinedMessageDTO[] =
        PredefinedMessageMapper.listToDTO(
          predefinedMessages
        ) as IPredefinedMessageDTO[];

      return Result.ok<IPredefinedMessageDTO[]>(predefinedMessageDTOArray);
    } catch (e: any) {
      console.error(e);
      return Result.fail<IPredefinedMessageDTO[]>(
        e.error,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findPredefinedMessageById(
    predefinedMessageDbId: number
  ): Promise<Result<IPredefinedMessageDTO>> {
    try {
      const predefinedMessage = await this.predefinedMessageRepo.findById(
        predefinedMessageDbId
      );
      return this.handlePredefinedMessageResult(
        predefinedMessage,
        predefinedMessageDbId
      );
    } catch (e: any) {
      console.error(e);
      return Result.fail<IPredefinedMessageDTO>(
        "Something went wrong when finding the predefined message by id",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findPredefinedMessageByNameId(
    nameId: string
  ): Promise<Result<IPredefinedMessageDTO>> {
    try {
      const predefinedMessage =
        await this.predefinedMessageRepo.findByNameIdFullInformation(nameId);
      return this.handlePredefinedMessageResult(predefinedMessage, nameId);
    } catch (e: any) {
      console.error(e);
      return Result.fail<IPredefinedMessageDTO>(
        "Something went wrong when finding the predefined message by nameId",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private handlePredefinedMessageResult(
    predefinedMessage: PredefinedMessage | null,
    identifier: number | string
  ): Result<IPredefinedMessageDTO> {
    if (!predefinedMessage) {
      const errorMessage =
        typeof identifier === "number"
          ? `Predefined message with id ${identifier} not found`
          : `Predefined message with nameId ${identifier} not found`;

      return Result.fail<IPredefinedMessageDTO>(
        errorMessage,
        StatusCodes.NOT_FOUND
      );
    }

    const predefinedMessageDTO = PredefinedMessageMapper.toDTOWithChildren(
      predefinedMessage
    ) as IPredefinedMessageDTO;

    return Result.ok<IPredefinedMessageDTO>(predefinedMessageDTO);
  }

  private async savePredefinedMessage(
    predefinedMessageResult: PredefinedMessage
  ): Promise<IPredefinedMessageDTO> {
    const savedPredefinedMessage = await this.predefinedMessageRepo.save(
      predefinedMessageResult
    );
    const predefinedMessageDTOResult = PredefinedMessageMapper.toDTO(
      savedPredefinedMessage
    ) as IPredefinedMessageDTO;

    return predefinedMessageDTOResult;
  }

  async deleteAllPredefinedMessages(): Promise<Result<boolean>> {
    try {
      await this.predefinedMessageRepo.deleteAll();
      return Result.ok<boolean>(true);
    } catch (e: any) {
      console.error(e);
      return Result.fail<boolean>(
        "Something went wrong when deleting all predefined messages",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
