import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DTO } from "../core/infra/DTO";
import { Result } from "../core/logic/Result";
import { Dropdown } from "../domain/message/dropdown/dropdown";
import { DropdownValue } from "../domain/message/dropdown/dropdown-value/dropdownValue";
import { DropdownNameId } from "../domain/message/dropdown/dropdownNameId";
import { IDropdownDTO } from "../dto/messages/IDropdownDTO";
import { IDropdownValueDTO } from "../dto/messages/IDropdownValueDTO";
import { DropdownSchema } from "../sequelize_schemas/DropdownSchema";
import { DropdownValueMapper } from "./DropdownValueMapper";

export class DropdownMapper {
  public static async toDomain(raw: any): Promise<Dropdown> {
    const dropdownNameId = DropdownNameId.create(raw.nameId);

    const dtoResult = Result.combine([dropdownNameId]);

    dtoResult.isFailure ? console.log(dtoResult.error) : "";

    const dropdownOrError = Dropdown.create(
      {
        dbDropdownId: raw.id,
        dropdownNameId: dropdownNameId.getValue(),
        dropdownAsButton: raw.dropdownAsButton ? raw.dropdownAsButton : false,
      },
      new UniqueEntityID(raw.domainId)
    );

    if (dropdownOrError.isFailure) {
      throw new Error(dropdownOrError.error.toString());
    }

    return dropdownOrError.getValue();
  }

  public static async toDomainWithValues(raw: any): Promise<Dropdown> {
    const dropdownNameId = DropdownNameId.create(raw.nameId);
    const dtoResult = Result.combine([dropdownNameId]);

    dtoResult.isFailure ? console.log(dtoResult.error) : "";

    const dummyDropdownOrError = Dropdown.create(
      { dbDropdownId: raw.id, dropdownNameId: dropdownNameId.getValue() },
      new UniqueEntityID(raw.domainId)
    );

    let dropdownValues: DropdownValue[] = [];
    if (raw.dropdownValues) {
      const rawDropdownValues: IDropdownValueDTO[] = raw.dropdownValues;
      await Promise.all(
        rawDropdownValues.map(async (rawDropdownValue: IDropdownValueDTO) => {
          console.log(rawDropdownValue);
          const dropdownValue = await DropdownValueMapper.toDomain({
            ...rawDropdownValue,
            dropdown: dummyDropdownOrError.getValue(),
          });
          dropdownValues.push(dropdownValue);
        })
      );
    }

    const dropdownOrError = Dropdown.create(
      {
        dbDropdownId: raw.id,
        dropdownNameId: dropdownNameId.getValue(),
        dropdownValues: dropdownValues,
        dropdownAsButton: raw.asButton ? raw.asButton : false,
      },
      new UniqueEntityID(raw.domainId)
    );

    if (dropdownOrError.isFailure) {
      throw new Error(dropdownOrError.error.toString());
    }

    return dropdownOrError.getValue();
  }

  public static toDTO(dropdown: Dropdown): DTO {
    return {
      nameId: dropdown.dropdownNameId.value,
      asButton: dropdown.dropdownAsButton
        ? dropdown.dropdownAsButton
        : false,
    } as IDropdownDTO;
  }

  public static toDTOFromSchema(dropdownSchema: DropdownSchema): DTO {
    return {
      nameId: dropdownSchema.nameId,
      asButton: dropdownSchema.asButton
        ? dropdownSchema.asButton
        : false,
    } as IDropdownDTO;
  }

  public static toDTOWithValues(dropdown: Dropdown): DTO {
    return {
      nameId: dropdown.dropdownNameId.value,
      asButton: dropdown.dropdownAsButton
        ? dropdown.dropdownAsButton
        : false,
      dropdownValues: dropdown.dropdownValues
        ? dropdown.dropdownValues.map((dropdownValue) => {
            return {
              content: dropdownValue.dropdownValueContent.value,
              nameId: dropdownValue.dropdownValueNameId.value,
            };
          })
        : [],
    } as IDropdownDTO;
  }

  public static toPersistence(dropdown: Dropdown): any {
    const dropdownPersistence = {
      domainId: dropdown.id.toString(),
      nameId: dropdown.dropdownNameId.value,
      asButton: dropdown.dropdownAsButton ? dropdown.dropdownAsButton : false,
    };
    return dropdownPersistence;
  }
}
