import { IDropdownValueDTO } from "./IDropdownValueDTO";

export interface IDropdownDTO {
  nameId: string;
  dropdownValues?: IDropdownValueDTO[];
  asButton?: boolean;
}
