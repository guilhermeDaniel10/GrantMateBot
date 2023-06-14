import { IDropdownDTO } from "./IDropdownDTO";
import { IServiceCallDTO } from "./IServiceCallDTO";

export interface IPredefinedMessageDTO {
  id?: number;
  nameId: string;
  content: string;
  fromBot: boolean;
  selectable?: boolean;
  customizable?: boolean;
  canCancel?: boolean;
  dropdown?: IDropdownDTO;
  dropdownId?: number;
  dropdownNameId?: string;
  serviceCall?: IServiceCallDTO;
  serviceCallId?: number;
  serviceCallNameId?: string;
  openField?: boolean;
}
