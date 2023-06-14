import { Service } from "typedi";
import IDropdownRepo from "../interface_repositories/IDropdownRepo";
import { Dropdown } from "../../domain/message/dropdown/dropdown";
import { DropdownId } from "../../domain/message/dropdown/dropdownId";
import { DropdownNameId } from "../../domain/message/dropdown/dropdownNameId";
import { DropdownSchema } from "../../sequelize_schemas/DropdownSchema";
import { DropdownMapper } from "../../mappers/DropdownMapper";
import { DropdownValueSchema } from "../../sequelize_schemas/DropdownValueSchema";

@Service()
export default class DropdownRepo implements IDropdownRepo {
  async exists(dropdownNameId: DropdownNameId): Promise<boolean> {
    const wantedDropdownNameId =
      dropdownNameId instanceof DropdownNameId
        ? (<DropdownNameId>dropdownNameId).value
        : dropdownNameId;
    const wantedDropdown = await DropdownSchema.findOne({
      where: { nameId: wantedDropdownNameId },
    });

    return !!wantedDropdown === true;
  }
  async save(dropdown: Dropdown): Promise<Dropdown> {
    const foundDropdown = await DropdownSchema.findOne({
      where: { nameId: dropdown.dropdownNameId.value },
    });
    try {
      if (!foundDropdown) {
        const rawDropdown: any = DropdownMapper.toPersistence(dropdown);

        const dropdownCreated = await DropdownSchema.create(rawDropdown);
        await dropdownCreated.save();

        return DropdownMapper.toDomain(dropdownCreated);
      } else {
        foundDropdown.nameId = dropdown.dropdownNameId.value;

        await foundDropdown.save();
        return dropdown;
      }
    } catch (err) {
      throw err;
    }
  }

  async saveIfNotExists(dropdown: Dropdown): Promise<Dropdown> {
    const foundDropdown = await DropdownSchema.findOne({
      where: { nameId: dropdown.dropdownNameId.value },
    });
    try {
      if (!foundDropdown) {
        const rawDropdown: any = DropdownMapper.toPersistence(dropdown);

        const dropdownCreated = await DropdownSchema.create(rawDropdown);
        await dropdownCreated.save();

        return DropdownMapper.toDomain(dropdownCreated);
      } else {
        return dropdown;
      }
    } catch (err) {
      throw err;
    }
  }
  upload(dropdown: Dropdown): Promise<Dropdown> {
    throw new Error("Method not implemented.");
  }
  delete(dropdownId: number | DropdownId): Promise<Dropdown> {
    throw new Error("Method not implemented.");
  }

  async findByDbId(dropdownId: number): Promise<Dropdown | undefined> {
    try {
      return DropdownSchema.findOne({
        where: { id: dropdownId },
      }).then((foundDropdown) => {
        if (!foundDropdown) return undefined;
        return DropdownMapper.toDomain(foundDropdown);
      });
    } catch (err) {
      throw err;
    }
  }

  async findByNameId(
    dropdownNameId: string | DropdownNameId
  ): Promise<Dropdown | null> {
    try {
      const wantedDropdownNameId =
        dropdownNameId instanceof DropdownNameId
          ? (<DropdownNameId>dropdownNameId).value
          : dropdownNameId;
      return DropdownSchema.findOne({
        where: { nameId: wantedDropdownNameId },
      }).then((foundDropdown) => {
        if (!foundDropdown) return null;
        return DropdownMapper.toDomain(foundDropdown);
      });
    } catch (err) {
      throw err;
    }
  }

  async findDropdownWithValuesByNameId(
    dropdownNameId: string | DropdownNameId
  ): Promise<Dropdown | null> {
    try {
      const wantedDropdownNameId =
        dropdownNameId instanceof DropdownNameId
          ? (<DropdownNameId>dropdownNameId).value
          : dropdownNameId;

      const foundDropdown = await DropdownSchema.findOne({
        where: { nameId: wantedDropdownNameId },
        include: [{ model: DropdownValueSchema, as: "dropdownValues" }],
      });

      if (!foundDropdown) return null;
      return DropdownMapper.toDomainWithValues(foundDropdown.toJSON());
    } catch (err) {
      throw err;
    }
  }

  async deleteAll(): Promise<void> {
    await DropdownSchema.destroy({ where: {} });
  }
}
