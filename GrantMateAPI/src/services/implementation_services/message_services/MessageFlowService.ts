import Container, { Inject, Service } from "typedi";
import IMessageFlowService from "../../interface_services/message_services/IMessageFlowService";
import { Result } from "../../../core/logic/Result";
import { IInputMessageDTO } from "../../../dto/messages/IInputMessageDTO";
import { IPredefinedMessageDTO } from "../../../dto/messages/IPredefinedMessageDTO";
import config from "../../../config";
import IPredefinedMessageReadService from "../../interface_services/message_services/IPredefinedMessageReadService";
import IPredefinedMessageRelationRepo from "../../../repositories/interface_repositories/IPredefinedMessageRelationRepo";
import { PredefinedMessageMapper } from "../../../mappers/PredefinedMessageMapper";
import IDropdownService from "../../interface_services/message_services/IDropdownReadService";
import { IDropdownValueDTO } from "../../../dto/messages/IDropdownValueDTO";
import { PredefinedMessageRelation } from "../../../domain/message/predefined-message-relations/predefinedMessageRelation";
import { PredefinedMessage } from "../../../domain/message/predefined-message-content/predefinedMessage";
import { IOutputMessageDTO } from "../../../dto/messages/IOutputMessageDTO";
import IRestCommunicator from "../../../communicators/interface-communicators/IRestCommunicator";
import { object } from "joi";
import { IServiceCallDTO } from "../../../dto/messages/IServiceCallDTO";
import { IRequestDTO } from "../../../dto/IRequestDTO";
import { IResponseDTO } from "../../../dto/IResponseDTO";

@Service()
export default class MessageFlowService implements IMessageFlowService {
  communicator: IRestCommunicator;

  constructor(
    @Inject(config.repos.predefinedMessageRelation.name)
    private predefinedMessageRelationRepo: IPredefinedMessageRelationRepo,
    @Inject(config.services.predefinedMessageReader.name)
    private predefinedMessageService: IPredefinedMessageReadService,
    @Inject(config.services.dropdownReader.name)
    private dropdownService: IDropdownService
  ) {
    this.communicator = Container.get("RestCommunicator");
  }
  async getInitialMessage(): Promise<Result<IOutputMessageDTO>> {
    try {
      const initialMessageRequest =
        await this.predefinedMessageService.findPredefinedMessageByNameId(
          "GREETING"
        );

      if (initialMessageRequest.isFailure) {
        throw new Error("Initial message not found");
      }

      const initialMessage = initialMessageRequest.getValue();
      const outputMessageDTO: IOutputMessageDTO = {
        mainMessage: initialMessage,
      };

      return Result.ok<IOutputMessageDTO>(outputMessageDTO);
    } catch (error) {
      console.log(error);
      return Result.fail<IOutputMessageDTO>("Could not get initial message");
    }
  }

  async getNextMessage(
    inputMessage: IInputMessageDTO
  ): Promise<Result<IOutputMessageDTO>> {
    try {
      let predefinedMessageDTO: IPredefinedMessageDTO | null = null;
      if (
        inputMessage.selectedDropdownValueId ||
        inputMessage.selectedDropdownValueNameId
      ) {
        let nextMessage: PredefinedMessageRelation | null = null;
        const dropdownValueDTO =
          await this.getPredefinedMessageFromDropdownValue(inputMessage);

        if (dropdownValueDTO.isSuccess) {
          nextMessage =
            await this.predefinedMessageRelationRepo.findByDropdownValue(
              dropdownValueDTO.getValue().dbId!
            );

          if (!nextMessage) {
            const nextPredefinedMessage =
              await this.getPredefinedMessageFromSimpleMessage(inputMessage);

            predefinedMessageDTO = (
              await this.getNextMessageDTO(nextPredefinedMessage.getValue())
            ).getValue();
          } else {
            predefinedMessageDTO = (
              await this.getNextMessageDTO(nextMessage.predefinedMessageB)
            ).getValue();
          }
        }
      } else {
        const nextPredefinedMessage =
          await this.getPredefinedMessageFromSimpleMessage(inputMessage);

        predefinedMessageDTO = (
          await this.getNextMessageDTO(nextPredefinedMessage.getValue())
        ).getValue();
      }

      if (!predefinedMessageDTO) {
        throw new Error("Predefined message not found");
      }

      const outputDTO: IOutputMessageDTO = await this.processInformation(
        predefinedMessageDTO,
        inputMessage
      );

      return Result.ok<IOutputMessageDTO>(outputDTO);
    } catch (error) {
      console.log(error);
      return Result.fail<IOutputMessageDTO>("Error getting next message");
    }
  }

  private async processInformation(
    predefinedMessageDTO: IPredefinedMessageDTO,
    inputMessage: IInputMessageDTO
  ): Promise<IOutputMessageDTO> {
    const outputDTO: IOutputMessageDTO = {
      mainMessage: predefinedMessageDTO,
    };

    outputDTO.mainMessage.content = this.processNextMessageContent(
      inputMessage,
      outputDTO
    );
    outputDTO.serviceResponse = await this.processServiceCallMessage(
      inputMessage,
      outputDTO
    );

    return outputDTO;
  }

  private processNextMessageContent(
    inputMessage: IInputMessageDTO,
    outputMessage: IOutputMessageDTO
  ): string {
    const inputUsefulPayload = inputMessage.usefulPayload;
    let outputMessageContent = outputMessage.mainMessage.content;
    const customContentRegex = /{{(.*?)}}/g;

    const matchedCustomOutputContent =
      outputMessageContent.match(customContentRegex);

    if (inputUsefulPayload) {
      Object.entries(inputUsefulPayload).forEach(([key, value]) => {
        const keyString: string = key as string; // Explicitly type the key as string
        const valueString: string = value as string; // Explicitly type the value as string

        if (matchedCustomOutputContent) {
          matchedCustomOutputContent.forEach((matchedKey) => {
            if (matchedKey.toUpperCase().includes(keyString.toUpperCase())) {
              outputMessageContent = outputMessageContent.replace(
                matchedKey,
                `'${valueString}'`
              );
            }
          });
        }
      });
    }

    return outputMessageContent;
  }

  private async processServiceCallMessage(
    inputMessage: IInputMessageDTO,
    outputMessage: IOutputMessageDTO
  ): Promise<object[] | undefined> {
    let outputServiceCall = outputMessage.mainMessage.serviceCall;
    let inputServiceCallPayload = inputMessage.usefulPayload;

    
    console.log(inputServiceCallPayload);
    const serviceCallRegex = "{{SERVICE_CALL}}";

    if (!outputServiceCall) {
      return undefined;
    }

    if (!inputServiceCallPayload) {
      return undefined;
    }

    Object.entries(inputServiceCallPayload).forEach(([key, value]) => {
      const inputKeyString: string = key as string; // Explicitly type the key as string
      const inputValueString: string = value as string; // Explicitly type the value as string

      Object.entries(outputServiceCall!.payload).forEach(([key, value]) => {
        const outputKeyString: string = key as string; // Explicitly type the key as string
        console.log(inputKeyString.toUpperCase());
        console.log(outputKeyString.toUpperCase());

        if (inputKeyString.toUpperCase() === outputKeyString.toUpperCase()) {
          (outputMessage.mainMessage.serviceCall!.payload as any)[
            inputKeyString
          ] = inputValueString;
        }
      });
    });

    try {
      const serviceCallResponse = await this.makeServiceCall(outputServiceCall);
      console.log(serviceCallResponse);

      console.log(serviceCallResponse.data);
      console.log(Object.values(serviceCallResponse.data));
      if (!serviceCallResponse.success) {
        throw new Error("Error making service call");
      }

      outputMessage.serviceResponse = serviceCallResponse.data;
      console.log(outputMessage.mainMessage.content);
    } catch (error) {
      console.log(error);
    }

    return outputMessage.serviceResponse;
  }

  private async makeServiceCall(
    serviceConf: IServiceCallDTO
  ): Promise<IResponseDTO<any>> {
    const requestConf: IRequestDTO = {
      url: serviceConf.endpoint,
      data: serviceConf.payload,
    };

    console.log(requestConf);
    const serviceCallResponse = await this.communicator.sendRequest(
      requestConf
    );

    return serviceCallResponse;
  }

  private async getOriginalPredefinedMessage(inputMessage: IInputMessageDTO) {
    return await this.predefinedMessageService.findPredefinedMessageById(
      inputMessage.predefinedMessageId!
    );
  }

  private async getPredefinedMessageFromDropdownValue(
    inputMessage: IInputMessageDTO
  ): Promise<Result<IDropdownValueDTO>> {
    const dropdownValueId = inputMessage.selectedDropdownValueId;
    const dropdownValueNameId = inputMessage.selectedDropdownValueNameId;

    if (dropdownValueId || dropdownValueNameId) {
      const dropdownDTO = dropdownValueId
        ? await this.dropdownService.findDropdownValueById(dropdownValueId!)
        : await this.dropdownService.findDropdownValueByNameId(
            dropdownValueNameId
          );

      console.log(dropdownDTO.getValue());
      return Result.ok<IDropdownValueDTO>(dropdownDTO.getValue());
    }

    return Result.fail<IDropdownValueDTO>("Dropdown value not found");
  }

  private async getPredefinedMessageFromSimpleMessage(
    inputMessage: IInputMessageDTO
  ): Promise<Result<PredefinedMessage>> {
    const fullPredefinedMessageDTO = inputMessage.predefinedMessageId
      ? await this.predefinedMessageService.findPredefinedMessageById(
          inputMessage.predefinedMessageId
        )
      : await this.predefinedMessageService.findPredefinedMessageByNameId(
          inputMessage.selectedDropdownValueNameId
        );

    const predefinedMessageAId = fullPredefinedMessageDTO.getValue().id;

    if (!predefinedMessageAId) {
      return Result.fail<PredefinedMessage>("Predefined message ID not found");
    }

    const messageRelation =
      await this.predefinedMessageRelationRepo.findByMessageAId(
        predefinedMessageAId
      );

    if (!messageRelation) {
      throw new Error("Predefined message relation not found");
    }

    if (inputMessage.canceled) {
      if (messageRelation.predefinedMessageBOnCancel) {
        return Result.ok<PredefinedMessage>(
          messageRelation.predefinedMessageBOnCancel
        );
      }
    }

    return Result.ok<PredefinedMessage>(messageRelation.predefinedMessageB);
  }

  private async getNextMessageDTO(
    predefinedMessage: PredefinedMessage
  ): Promise<Result<IPredefinedMessageDTO>> {
    const predefinedMessageDTO = PredefinedMessageMapper.toDTOWithChildren(
      predefinedMessage
    ) as IPredefinedMessageDTO;

    return Result.ok<IPredefinedMessageDTO>(predefinedMessageDTO);
  }
}
