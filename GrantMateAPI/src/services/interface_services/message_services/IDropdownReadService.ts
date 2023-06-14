import { Result } from "../../../core/logic/Result";
import { IDropdownCorrespondingValuesDTO } from "../../../dto/messages/IDropdownCorrespondingValuesDTO";
import { IDropdownDTO } from "../../../dto/messages/IDropdownDTO";
import { IDropdownValueDTO } from "../../../dto/messages/IDropdownValueDTO";

export default interface IDropdownService {
  readDropdownMessages(): Promise<Result<IDropdownCorrespondingValuesDTO[]>>;
  findDropdownWithValuesByNameId(
    dropdownNameId: string
  ): Promise<Result<IDropdownDTO>>;
  findDropdownValueById(dropdownId: number): Promise<Result<IDropdownValueDTO>>;
  findDropdownValueByNameId(
    dropdownNameId: string
  ): Promise<Result<IDropdownValueDTO>>;
  deleteAllDropdowns(): Promise<Result<boolean>>;
  readData(): Promise<IDropdownCorrespondingValuesDTO[]>;
}
