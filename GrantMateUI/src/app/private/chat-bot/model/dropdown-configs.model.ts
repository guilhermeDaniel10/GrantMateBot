import { DropdownValueConfigs } from './dropdown-value-configs.model';

export interface DropdownConfigs {
  nameId: string;
  asButton: boolean;
  dropdownValues: DropdownValueConfigs[];
}
