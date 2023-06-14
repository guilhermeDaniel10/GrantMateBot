import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { DropdownValue } from "./dropdown-value/dropdownValue";
import { DropdownId } from "./dropdownId";
import { DropdownNameId } from "./dropdownNameId";

interface DropdownProps {
  dbDropdownId?: number;
  dropdownNameId: DropdownNameId;
  dropdownValues?: DropdownValue[];
  dropdownAsButton?: boolean;
}

export class Dropdown extends AggregateRoot<DropdownProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get dropdownId(): DropdownId {
    return DropdownId.caller(this.id);
  }

  get dbDropdownId(): number | undefined {
    return this.props.dbDropdownId;
  }

  get dropdownNameId(): DropdownNameId {
    return this.props.dropdownNameId;
  }

  get dropdownValues(): DropdownValue[] | undefined {
    return this.props.dropdownValues;
  }

  get dropdownAsButton(): boolean | undefined {
    return this.props.dropdownAsButton;
  }

  private constructor(props: DropdownProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: DropdownProps,
    id?: UniqueEntityID
  ): Result<Dropdown> {
    const guardedProps = [
      {
        argument: props.dropdownNameId,
        argumentName: "dropdownValueNameId",
      },
    ];
    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Dropdown>(guardResult.message || "");
    } else {
      const dropdownValue = new Dropdown(
        {
          ...props,
        },
        id
      );

      return Result.ok<Dropdown>(dropdownValue);
    }
  }
}
