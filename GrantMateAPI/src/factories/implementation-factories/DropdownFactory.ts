import { Service } from "typedi";
import IDropdownFactory from "../interface-factories/IDropdownFactory";
import { Result } from "../../core/logic/Result";
import { Dropdown } from "../../domain/message/dropdown/dropdown";
import { IDropdownCorrespondingValuesDTO } from "../../dto/messages/IDropdownCorrespondingValuesDTO";
import { DropdownNameId } from "../../domain/message/dropdown/dropdownNameId";

@Service()
export default class DropdownFactory implements IDropdownFactory {
  constructor() {}

  public async createDropdown(
    dropdownMessage: IDropdownCorrespondingValuesDTO
  ): Promise<Result<Dropdown>> {
    const dropdownNameId = DropdownNameId.create(dropdownMessage.nameId);
    if (dropdownNameId.isFailure) {
      throw Result.fail<IDropdownCorrespondingValuesDTO>(
        "Cannot create dropdown"
      );
    }

    const dropdownOrError = Dropdown.create({
      dropdownNameId: dropdownNameId.getValue(),
      dropdownAsButton: dropdownMessage.asButton,
    });

    if (dropdownOrError.isFailure) {
      throw Result.fail<IDropdownCorrespondingValuesDTO>(
        "Cannot create dropdown"
      );
    }
    return dropdownOrError;
  }
}
