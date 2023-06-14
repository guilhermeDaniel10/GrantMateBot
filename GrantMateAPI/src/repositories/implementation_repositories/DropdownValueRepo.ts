import { Inject, Service } from "typedi";
import IDropdownValueRepo from "../interface_repositories/IDropdownValueRepo";
import { DropdownValue } from "../../domain/message/dropdown/dropdown-value/dropdownValue";
import { DropdownValueId } from "../../domain/message/dropdown/dropdown-value/dropdownValueId";
import { DropdownValueNameId } from "../../domain/message/dropdown/dropdown-value/dropdownValueNameId";
import { DropdownValueSchema } from "../../sequelize_schemas/DropdownValueSchema";
import config from "../../config";
import IDropdownRepo from "../interface_repositories/IDropdownRepo";
import { DropdownSchema } from "../../sequelize_schemas/DropdownSchema";
import { DropdownValueMapper } from "../../mappers/DropdownValueMapper";
import { DropdownMapper } from "../../mappers/DropdownMapper";

@Service()
export default class DropdownValueRepo implements IDropdownValueRepo {
  constructor(
    @Inject(config.repos.dropdown.name) private dropdownRepo: IDropdownRepo
  ) {}
  async exists(dropdownValueNameId: DropdownValueNameId): Promise<boolean> {
    const wantedDropdownValueNameId =
      dropdownValueNameId instanceof DropdownValueNameId
        ? (<DropdownValueNameId>dropdownValueNameId).value
        : dropdownValueNameId;
    const wantedDropdownValue = await DropdownValueSchema.findOne({
      where: { nameId: wantedDropdownValueNameId },
    });

    return !!wantedDropdownValue === true;
  }
  async save(dropdownValue: DropdownValue): Promise<DropdownValue> {
    const dropdown = dropdownValue.dropdown;
    const foundDropdown = await DropdownSchema.findOne({
      where: { nameId: dropdown.dropdownNameId.value },
    });

    if (!foundDropdown) {
      throw new Error("Dropdown not found");
    }

    const foundDropdownValue = await DropdownValueSchema.findOne({
      where: { nameId: dropdownValue.dropdownValueNameId.value },
    });

    if (foundDropdownValue) {
      foundDropdownValue.nameId = dropdownValue.dropdownValueNameId.value;
      foundDropdownValue.content = dropdownValue.dropdownValueContent.value;

      await foundDropdownValue.save();
      return dropdownValue;
    } else {
      const rawDropdownValue: any = {
        nameId: dropdownValue.dropdownValueNameId.value,
        content: dropdownValue.dropdownValueContent.value,
        dropdownId: foundDropdown.id,
      };

      const dropdownValueCreated = await DropdownValueSchema.create(
        rawDropdownValue
      );
      await dropdownValueCreated.save();

      return dropdownValue;
    }
  }
  upload(dropdownValue: DropdownValue): Promise<DropdownValue> {
    throw new Error("Method not implemented.");
  }
  delete(dropdownValueId: number | DropdownValueId): Promise<DropdownValue> {
    throw new Error("Method not implemented.");
  }
  async findByNameId(
    dropdownValueNameId: string | DropdownValueNameId
  ): Promise<DropdownValue | null> {
    const nameId =
      dropdownValueNameId instanceof DropdownValueNameId
        ? dropdownValueNameId.value
        : dropdownValueNameId;

    const foundDropdownValue = await DropdownValueSchema.findOne({
      where: { nameId: nameId },
    });

    if (!foundDropdownValue) {
      return null;
    }

    const foundDropdown = await DropdownSchema.findOne({
      where: { id: foundDropdownValue.dropdownId },
    });

    if (!foundDropdown) {
      throw new Error("Dropdown not found");
    }

    foundDropdownValue.dropdown = foundDropdown;

    const domainDropdownValue =
      DropdownValueMapper.toDomain(foundDropdownValue);

    return domainDropdownValue;
  }

  async findByDropdownDBId(
    dropdownDBId: number
  ): Promise<DropdownValue | null> {
    const foundDropdownValue = await DropdownValueSchema.findOne({
      where: { id: dropdownDBId },
    });

    if (!foundDropdownValue) {
      return null;
    }

    const foundDropdown = await DropdownSchema.findOne({
      where: { id: foundDropdownValue.dropdownId },
    });

    if (!foundDropdown) {
      throw new Error("Dropdown not found");
    }

    foundDropdownValue.dropdown = foundDropdown;

    const domainDropdownValue =
      DropdownValueMapper.toDomain(foundDropdownValue);

    return domainDropdownValue;
  }

  async deleteAll(): Promise<void> {
    await DropdownValueSchema.destroy({ where: {} });
  }
}
