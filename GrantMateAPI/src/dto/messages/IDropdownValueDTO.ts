import { IDropdownDTO } from "./IDropdownDTO";

export interface IDropdownValueDTO {
  dbId?: number;
  nameId: string;
  content: string;
  dropdown?: IDropdownDTO;
}
