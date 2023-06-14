import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DTO } from "../core/infra/DTO";
import { Result } from "../core/logic/Result";
import { DropdownValue } from "../domain/message/dropdown/dropdown-value/dropdownValue";
import { DropdownValueContent } from "../domain/message/dropdown/dropdown-value/dropdownValueContent";
import { DropdownValueNameId } from "../domain/message/dropdown/dropdown-value/dropdownValueNameId";
import { IDropdownValueDTO } from "../dto/messages/IDropdownValueDTO";
import { DropdownSchema } from "../sequelize_schemas/DropdownSchema";
import { DropdownMapper } from "./DropdownMapper";

export class DropdownValueMapper {
  public static async toDomain(raw: any): Promise<DropdownValue> {
    const dbId = raw.id;
    const dropdownValueNameId = DropdownValueNameId.create(raw.nameId);
    const dropdownValueContent = DropdownValueContent.create(raw.content);
    const dropdown =
      raw.dropdown instanceof DropdownSchema
        ? await DropdownMapper.toDomain(raw.dropdown)
        : raw.dropdown;

    const dtoResult = Result.combine([
      dropdownValueNameId,
      dropdownValueContent,
    ]);

    dtoResult.isFailure ? console.log(dtoResult.error) : "";

    const dropdownValueOrError = DropdownValue.create(
      {
        dbId: dbId,
        dropdownValueNameId: dropdownValueNameId.getValue(),
        dropdownValueContent: dropdownValueContent.getValue(),
        dropdown: dropdown,
      },
      new UniqueEntityID(raw.domainId)
    );

    if (dropdownValueOrError.isFailure) {
      throw new Error(dropdownValueOrError.error.toString());
    }

    return dropdownValueOrError.getValue();
  }
  public static toDTO(dropdownValue: DropdownValue): DTO {
    const dropdownValueDTO = {
      dbId: dropdownValue.dbId,
      nameId: dropdownValue.dropdownValueNameId.value,
      content: dropdownValue.dropdownValueContent.value,
      dropdown: DropdownMapper.toDTO(dropdownValue.dropdown),
    } as IDropdownValueDTO;

    return dropdownValueDTO;
  }
  public static toPersistence(dropdownValue: DropdownValue): any {
    const dropdownValuePersistence = {
      domainId: dropdownValue.id.toString(),
      nameId: dropdownValue.dropdownValueNameId.value,
      content: dropdownValue.dropdownValueContent.value,
      dropdown: dropdownValue.dropdown,
    };
    return dropdownValuePersistence;
  }
}
