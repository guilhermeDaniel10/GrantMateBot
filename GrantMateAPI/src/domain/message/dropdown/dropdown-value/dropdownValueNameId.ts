import { StatusCodes } from "http-status-codes";
import { ValueObject } from "../../../../core/domain/ValueObject";
import { Result } from "../../../../core/logic/Result";
import { Guard } from "../../../../core/logic/Guard";

interface DropdownValueNameIdProps {
  value: string;
}

export class DropdownValueNameId extends ValueObject<DropdownValueNameIdProps> {
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: DropdownValueNameIdProps) {
    super(props);
  }

  public static create(
    dropdownValueNameId: string
  ): Result<DropdownValueNameId> {
    const dropdownValueNameIdResult = Guard.againstNullOrUndefined(
      dropdownValueNameId,
      "dropdownValueNameId"
    );

    if (!dropdownValueNameIdResult.succeeded) {
      return Result.fail<DropdownValueNameId>(
        dropdownValueNameIdResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      dropdownValueNameId
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<DropdownValueNameId>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<DropdownValueNameId>(
      new DropdownValueNameId({ value: dropdownValueNameId })
    );
  }
}
