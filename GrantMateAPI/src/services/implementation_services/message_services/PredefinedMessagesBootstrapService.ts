import { Inject, Service } from "typedi";
import { IMessagesBootstrapDTO } from "../../../dto/messages/IMessagesBootstrapDTO";
import IPredefinedMessageBootstrapService from "../../interface_services/message_services/IPredefinedMessagesBootstrapService";
import config from "../../../config";
import IPredefinedMessageReadService from "../../interface_services/message_services/IPredefinedMessageReadService";
import IDropdownReadService from "../../interface_services/message_services/IDropdownReadService";
import IServiceCallService from "../../interface_services/message_services/IServiceCallService";
import IPredefinedMessageRelationReadService from "../../interface_services/message_services/IPredefinedMessageRelationReadService";
import { IDropdownDTO } from "../../../dto/messages/IDropdownDTO";
import { IServiceCallDTO } from "../../../dto/messages/IServiceCallDTO";
import { IPredefinedMessageDTO } from "../../../dto/messages/IPredefinedMessageDTO";
import { IPredefinedMessageRelationDTO } from "../../../dto/messages/IPredefinedMessageRelationDTO";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";
import IPredefinedMessageRepo from "../../../repositories/interface_repositories/IPredefinedMessageRepo";

@Service()
export default class PredefinedMessagesBootstrapService
  implements IPredefinedMessageBootstrapService
{
  constructor(
    @Inject(config.services.predefinedMessageReader.name)
    private predefinedMessageReader: IPredefinedMessageReadService,
    @Inject(config.services.dropdownReader.name)
    private dropdownReader: IDropdownReadService,
    @Inject(config.services.serviceCallReader.name)
    private serviceCallReader: IServiceCallService,
    @Inject(config.services.predefinedMessageRelationReader.name)
    private predefinedMessageRelationReader: IPredefinedMessageRelationReadService
  ) {}

  async bootstrapPredefinedMessages(): Promise<Result<IMessagesBootstrapDTO>> {
    try {
      const dropdowns = await this.dropdownReader.readData();
      const serviceCalls = await this.serviceCallReader.readData();
      const predefinedMessages = await this.predefinedMessageReader.readData();
      const pMessagesRelations =
        await this.predefinedMessageRelationReader.readData();

      const messagesBootstrapDTO: IMessagesBootstrapDTO = {
        predefinedMessage: predefinedMessages,
        serviceCall: serviceCalls,
        dropdown: dropdowns,
      };
      return Result.ok<IMessagesBootstrapDTO>(messagesBootstrapDTO);
    } catch (e: any) {
      console.error(e);
      return Result.fail<IMessagesBootstrapDTO>(
        e.error,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAllPredefinedMessages(): Promise<Result<void>> {
    try {
      await this.predefinedMessageReader
        .deleteAllPredefinedMessages()
        .then(() => this.dropdownReader.deleteAllDropdowns())
        .then(() => this.serviceCallReader.deleteAllServiceCallMessages())
        .then(() => this.predefinedMessageRelationReader.deleteAllRelations())
        .catch((error) => {
          throw new Error(error.toString());
        });

      return Result.ok<void>();
    } catch (e: any) {
      console.error(e);
      return Result.fail<void>(
        "Could not delete predefined messages.",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
