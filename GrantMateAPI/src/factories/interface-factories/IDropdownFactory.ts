import { Result } from "../../core/logic/Result";
import { Dropdown } from "../../domain/message/dropdown/dropdown";
import { IDropdownCorrespondingValuesDTO } from "../../dto/messages/IDropdownCorrespondingValuesDTO";

export default interface IDropdownFactory {
    createDropdown(
    dropdownMessage: IDropdownCorrespondingValuesDTO
  ): Promise<Result<Dropdown>>;
}
