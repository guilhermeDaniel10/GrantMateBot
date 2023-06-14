import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DTO } from "../core/infra/DTO";
import { Result } from "../core/logic/Result";
import { PredefinedMessage } from "../domain/message/predefined-message-content/predefinedMessage";
import { PredefinedMessageContent } from "../domain/message/predefined-message-content/predefinedMessageContent";
import { PredefinedMessageFromBot } from "../domain/message/predefined-message-content/predefinedMessageFromBot";
import { PredefinedMessageNameId } from "../domain/message/predefined-message-content/predefinedMessageNameId";
import { IPredefinedMessageDTO } from "../dto/messages/IPredefinedMessageDTO";
import { DropdownMapper } from "./DropdownMapper";
import { ServiceCallMapper } from "./ServiceCallMapper";

export class PredefinedMessageMapper {
  public static async toDomain(raw: any): Promise<PredefinedMessage> {
    const dbId = raw.id;
    const predefinedMessageNameId = PredefinedMessageNameId.create(raw.nameId);
    const predefinedMessageContent = PredefinedMessageContent.create(
      raw.content
    );
    const predefinedMessageFromBot = PredefinedMessageFromBot.create(
      raw.fromBot
    );

    const dtoResult = Result.combine([
      dbId,
      predefinedMessageNameId,
      predefinedMessageContent,
      predefinedMessageFromBot,
    ]);

    dtoResult.isFailure ? console.log(dtoResult.error) : "";

    const predefinedMessageOrError = PredefinedMessage.create(
      {
        dbId: dbId ? dbId : undefined,
        predefinedMessageContent: predefinedMessageContent.getValue(),
        predefinedMessageFromBot: predefinedMessageFromBot.getValue(),
        predefinedMessageNameId: predefinedMessageNameId.getValue(),
        openField: raw.openField ? raw.openField : false,
        selectable: raw.selectable ? raw.selectable : false,
        customizable: raw.customizable ? raw.customizable : false,
        canCancel: raw.canCancel ? raw.canCancel : false,
      },
      new UniqueEntityID(raw.domainId)
    );

    if (predefinedMessageOrError.isFailure) {
      throw new Error(predefinedMessageOrError.error.toString());
    }

    return predefinedMessageOrError.getValue();
  }

  public static toDTO(predefinedMessage: PredefinedMessage): DTO {
    return {
      nameId: predefinedMessage.predefinedMessageNameId.value,
      content: predefinedMessage.predefinedMessageContent.value,
      fromBot: predefinedMessage.predefinedMessageFromBot.value,
      openField: predefinedMessage.openField
        ? predefinedMessage.openField
        : false,
      selectable: predefinedMessage.selectable
        ? predefinedMessage.selectable
        : false,
      customizable: predefinedMessage.customizable
        ? predefinedMessage.customizable
        : false,
      canCancel: predefinedMessage.canCancel
        ? predefinedMessage.canCancel
        : false,
    } as IPredefinedMessageDTO;
  }

  public static listToDTO(predefinedMessages: PredefinedMessage[]): DTO[] {
    const predefinedMessageDTOArray: IPredefinedMessageDTO[] = [];
    predefinedMessages.map((predefinedMessage: PredefinedMessage) => {
      const predefinedMessageDTO = PredefinedMessageMapper.toDTO(
        predefinedMessage
      ) as IPredefinedMessageDTO;
      predefinedMessageDTOArray.push(predefinedMessageDTO);
    });
    return predefinedMessageDTOArray;
  }

  public static toDTOWithChildren(predefinedMessage: PredefinedMessage): DTO {
    return {
      id: predefinedMessage.dbId ? predefinedMessage.dbId : undefined,
      nameId: predefinedMessage.predefinedMessageNameId.value,
      content: predefinedMessage.predefinedMessageContent.value,
      fromBot: predefinedMessage.predefinedMessageFromBot.value,
      openField: predefinedMessage.openField
        ? predefinedMessage.openField
        : false,
      selectable: predefinedMessage.selectable
        ? predefinedMessage.selectable
        : false,
      customizable: predefinedMessage.customizable
        ? predefinedMessage.customizable
        : false,
      canCancel: predefinedMessage.canCancel
        ? predefinedMessage.canCancel
        : false,
      dropdown: predefinedMessage.dropdown
        ? DropdownMapper.toDTOWithValues(predefinedMessage.dropdown)
        : null,
      serviceCall: predefinedMessage.serviceCall
        ? ServiceCallMapper.toDTO(predefinedMessage.serviceCall)
        : null,
    } as IPredefinedMessageDTO;
  }

  public static toPersistence(predefinedMessage: PredefinedMessage): any {
    const dropdownId = predefinedMessage.dropdown?.dbDropdownId;
    const serviceCallId = predefinedMessage.serviceCall?.dbServiceCallId;

    let predefinedMessagePersistence: any = {
      domainId: predefinedMessage.id.toString(),
      nameId: predefinedMessage.predefinedMessageNameId.value,
      content: predefinedMessage.predefinedMessageContent.value,
      fromBot: predefinedMessage.predefinedMessageFromBot.value,
      openField: predefinedMessage.openField
        ? predefinedMessage.openField
        : false,
      selectable: predefinedMessage.selectable
        ? predefinedMessage.selectable
        : false,
      customizable: predefinedMessage.customizable
        ? predefinedMessage.customizable
        : false,
      canCancel: predefinedMessage.canCancel
        ? predefinedMessage.canCancel
        : false,
    };

    if (dropdownId) {
      predefinedMessagePersistence.dropdownId = dropdownId;
    }

    if (serviceCallId) {
      predefinedMessagePersistence.serviceCallId = serviceCallId;
    }

    if (predefinedMessage.openField) {
      predefinedMessagePersistence.openField = predefinedMessage.openField;
    }

    if (predefinedMessage.selectable) {
      predefinedMessagePersistence.selectable = predefinedMessage.selectable;
    }

    if (predefinedMessage.customizable) {
      predefinedMessagePersistence.customizable =
        predefinedMessage.customizable;
    }

    if (predefinedMessage.canCancel) {
      predefinedMessagePersistence.canCancel = predefinedMessage.canCancel;
    }
    return predefinedMessagePersistence;
  }
}
