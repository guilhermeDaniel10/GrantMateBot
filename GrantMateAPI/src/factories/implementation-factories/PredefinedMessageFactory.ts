import { Inject, Service } from "typedi";
import { Result } from "../../core/logic/Result";
import { PredefinedMessage } from "../../domain/message/predefined-message-content/predefinedMessage";
import { PredefinedMessageContent } from "../../domain/message/predefined-message-content/predefinedMessageContent";
import { PredefinedMessageFromBot } from "../../domain/message/predefined-message-content/predefinedMessageFromBot";
import { PredefinedMessageNameId } from "../../domain/message/predefined-message-content/predefinedMessageNameId";
import { IPredefinedMessageDTO } from "../../dto/messages/IPredefinedMessageDTO";
import config from "../../config";
import IServiceCallRepo from "../../repositories/interface_repositories/IServiceCallRepo";
import IDropdownRepo from "../../repositories/interface_repositories/IDropdownRepo";
import IPredefinedMessageFactory from "../interface-factories/IPredefinedMessageFactory";

@Service()
export default class PredefinedMessageFactory implements IPredefinedMessageFactory {
  constructor(
    @Inject(config.repos.dropdown.name)
    private dropdownRepo: IDropdownRepo,
    @Inject(config.repos.serviceCall.name)
    private serviceCallRepo: IServiceCallRepo
  ) {}

  public async createPredefinedMessage(
    predefinedMessageDTO: IPredefinedMessageDTO
  ): Promise<Result<PredefinedMessage>> {
    const nameIdValue = predefinedMessageDTO.nameId;
    const dropdownNameIdValue = predefinedMessageDTO.dropdownNameId;
    const serviceCallNameIdValue = predefinedMessageDTO.serviceCallNameId;
    const predefinedMessageNameId = await PredefinedMessageNameId.create(
      predefinedMessageDTO.nameId
    );
    const predefinedMessageContent = await PredefinedMessageContent.create(
      predefinedMessageDTO.content
    );
    const predefinedMessageFromBot = await PredefinedMessageFromBot.create(
      predefinedMessageDTO.fromBot
    );
    const openField = predefinedMessageDTO.openField;
    const selectable = predefinedMessageDTO.selectable;
    const customizable = predefinedMessageDTO.customizable;
    const canCancel = predefinedMessageDTO.canCancel;

    const dropdown = dropdownNameIdValue
      ? await this.dropdownRepo.findByNameId(dropdownNameIdValue)
      : undefined;
    if (!dropdown && dropdownNameIdValue) {
      throw Result.fail<PredefinedMessage>("Dropdown does not exist");
    }

    const serviceCall = serviceCallNameIdValue
      ? await this.serviceCallRepo.findByNameId(serviceCallNameIdValue)
      : undefined;

    if (!serviceCall && serviceCallNameIdValue) {
      throw Result.fail<PredefinedMessage>("Service call does not exist");
    }

    const predefinedMessage = await PredefinedMessage.create({
      predefinedMessageNameId: predefinedMessageNameId.getValue(),
      predefinedMessageContent: predefinedMessageContent.getValue(),
      predefinedMessageFromBot: predefinedMessageFromBot.getValue(),
      openField: openField,
      selectable: selectable,
      customizable: customizable,
      canCancel: canCancel,
      dropdown: dropdown ? dropdown : undefined,
      serviceCall: serviceCall ? serviceCall : undefined,
    });

    return predefinedMessage;
  }
}
