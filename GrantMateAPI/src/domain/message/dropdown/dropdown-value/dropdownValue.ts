import { AggregateRoot } from "../../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { Guard } from "../../../../core/logic/Guard";
import { Result } from "../../../../core/logic/Result";
import { Dropdown } from "../dropdown";
import { DropdownValueContent } from "./dropdownValueContent";
import { DropdownValueId } from "./dropdownValueId";
import { DropdownValueNameId } from "./dropdownValueNameId";

interface DropdownValueProps {
  dbId?: number;
  dropdownValueNameId: DropdownValueNameId;
  dropdownValueContent: DropdownValueContent;
  dropdown: Dropdown;
}

export class DropdownValue extends AggregateRoot<DropdownValueProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get dbId(): number | undefined {
    return this.props.dbId;
  }

  get dropdownValueId(): DropdownValueId {
    return DropdownValueId.caller(this.id);
  }

  get dropdownValueNameId(): DropdownValueNameId {
    return this.props.dropdownValueNameId;
  }

  get dropdownValueContent(): DropdownValueContent {
    return this.props.dropdownValueContent;
  }

  get dropdown(): Dropdown {
    return this.props.dropdown;
  }

  private constructor(props: DropdownValueProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: DropdownValueProps,
    id?: UniqueEntityID
  ): Result<DropdownValue> {
    const guardedProps = [
      {
        argument: props.dropdownValueNameId,
        argumentName: "dropdownValueNameId",
      },
      {
        argument: props.dropdownValueContent,
        argumentName: "dropdownValueContent",
      },
      {
        argument: props.dropdown,
        argumentName: "dropdown",
      },
    ];
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<DropdownValue>(guardResult.message || "");
    } else {
      const dropdownValue = new DropdownValue(
        {
          ...props,
        },
        id
      );

      return Result.ok<DropdownValue>(dropdownValue);
    }
  }
}
