import { IDropdownDTO } from "./IDropdownDTO";
import { IPredefinedMessageDTO } from "./IPredefinedMessageDTO";
import { IServiceCallDTO } from "./IServiceCallDTO";

export interface IMessagesBootstrapDTO {
  serviceCall: IServiceCallDTO[];
  dropdown: IDropdownDTO[];
  predefinedMessage: IPredefinedMessageDTO[];
}
