import { Repo } from "../../core/infra/Repo";
import { Dropdown } from "../../domain/message/dropdown/dropdown";
import { DropdownId } from "../../domain/message/dropdown/dropdownId";
import { DropdownNameId } from "../../domain/message/dropdown/dropdownNameId";

export default interface IDropdownRepo extends Repo<Dropdown> {
  exists(dropdownNameId: DropdownNameId): Promise<boolean>;
  save(dropdown: Dropdown): Promise<Dropdown>;
  upload(dropdown: Dropdown): Promise<Dropdown>;
  delete(dropdownId: DropdownId | number): Promise<Dropdown>;
  saveIfNotExists(dropdown: Dropdown): Promise<Dropdown>;
  findByDbId(dropdownId: number): Promise<Dropdown | undefined>;
  findByNameId(
    dropdownNameId: DropdownNameId | string
  ): Promise<Dropdown | null>;
  findDropdownWithValuesByNameId(
    dropdownNameId: string | DropdownNameId
  ): Promise<Dropdown | null>;
  deleteAll(): Promise<void>;
}
