import { DropdownConfigs } from './dropdown-configs.model';

export interface MainMessageModel {
  id?: number;
  nameId: string;
  content: string;
  fromBot: boolean;
  openField: boolean;
  dropdown?: DropdownConfigs;
  serviceCall?: any;
  selectable: boolean;
  customizable?: boolean;
  canCancel?: boolean;
}
