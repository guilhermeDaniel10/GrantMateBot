import { Result } from "../../core/logic/Result";
import { Dropdown } from "../../domain/message/dropdown/dropdown";
import { DropdownValue } from "../../domain/message/dropdown/dropdown-value/dropdownValue";
import { IDropdownValueDTO } from "../../dto/messages/IDropdownValueDTO";

export default interface IDropdownValueFactory {
  createDropdownValue(
    dropdownValue: IDropdownValueDTO,
    dropdownOrError: Dropdown
  ): Result<DropdownValue>;
}
