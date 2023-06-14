import { Service } from "typedi";
import IDropdownValueFactory from "../interface-factories/IDropdownValueFactory";
import { IDropdownValueDTO } from "../../dto/messages/IDropdownValueDTO";
import { Dropdown } from "../../domain/message/dropdown/dropdown";
import { Result } from "../../core/logic/Result";
import { DropdownValue } from "../../domain/message/dropdown/dropdown-value/dropdownValue";
import { DropdownValueNameId } from "../../domain/message/dropdown/dropdown-value/dropdownValueNameId";
import { DropdownValueContent } from "../../domain/message/dropdown/dropdown-value/dropdownValueContent";
import { IDropdownCorrespondingValuesDTO } from "../../dto/messages/IDropdownCorrespondingValuesDTO";
import { StatusCodes } from "http-status-codes";

@Service()
export default class DropdownValueFactory implements IDropdownValueFactory {
  constructor() {}

  createDropdownValue(
    dropdownValue: IDropdownValueDTO,
    dropdownOrError: Dropdown
  ): Result<DropdownValue> {
    const dropdownValueNameId = DropdownValueNameId.create(
      dropdownValue.nameId
    );
    const dropdownValueContent = DropdownValueContent.create(
      dropdownValue.content
    );

    if (dropdownValueNameId.isFailure || dropdownValueContent.isFailure) {
      throw Result.fail<DropdownValue>(
        "Cannot create dropdown value",
        StatusCodes.FORBIDDEN
      );
    }

    const dropdownValueOrError = DropdownValue.create({
      dropdownValueNameId: dropdownValueNameId.getValue(),
      dropdownValueContent: dropdownValueContent.getValue(),
      dropdown: dropdownOrError,
    });

    if (dropdownValueOrError.isFailure) {
      throw Result.fail<DropdownValue>(
        "Cannot create dropdown value",
        StatusCodes.FORBIDDEN
      );
    }

    return dropdownValueOrError;
  }
}
