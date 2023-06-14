import { StatusCodes } from "http-status-codes";
import { ValueObject } from "../../../core/domain/ValueObject";
import { Result } from "../../../core/logic/Result";
import { Guard } from "../../../core/logic/Guard";

interface DropdownNameIdProps {
  value: string;
}

export class DropdownNameId extends ValueObject<DropdownNameIdProps> {
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: DropdownNameIdProps) {
    super(props);
  }

  public static create(dropdownNameId: string): Result<DropdownNameId> {
    const dropdownNameIdResult = Guard.againstNullOrUndefined(
      dropdownNameId,
      "dropdownNameId"
    );

    if (!dropdownNameIdResult.succeeded) {
      return Result.fail<DropdownNameId>(
        dropdownNameIdResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      dropdownNameId
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<DropdownNameId>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<DropdownNameId>(
      new DropdownNameId({ value: dropdownNameId })
    );
  }
}
