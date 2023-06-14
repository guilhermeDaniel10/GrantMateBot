import { Repo } from "../../core/infra/Repo";
import { DropdownValue } from "../../domain/message/dropdown/dropdown-value/dropdownValue";
import { DropdownValueId } from "../../domain/message/dropdown/dropdown-value/dropdownValueId";
import { DropdownValueNameId } from "../../domain/message/dropdown/dropdown-value/dropdownValueNameId";

export default interface IDropdownValueRepo extends Repo<DropdownValue> {
  exists(dropdownValueNameId: DropdownValueNameId): Promise<boolean>;
  save(dropdownValue: DropdownValue): Promise<DropdownValue>;
  upload(dropdownValue: DropdownValue): Promise<DropdownValue>;
  delete(dropdownValueId: DropdownValueId | number): Promise<DropdownValue>;
  findByNameId(
    dropdownValueNameId: DropdownValueNameId | string
  ): Promise<DropdownValue | null>;
  findByDropdownDBId(dropdownDBId: number): Promise<DropdownValue | null>;
  deleteAll(): Promise<void>;
}
