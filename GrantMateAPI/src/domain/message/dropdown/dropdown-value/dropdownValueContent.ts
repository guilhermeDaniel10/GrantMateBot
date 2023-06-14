import { StatusCodes } from "http-status-codes";
import { ValueObject } from "../../../../core/domain/ValueObject";
import { Result } from "../../../../core/logic/Result";
import { Guard } from "../../../../core/logic/Guard";

interface DropdownValueContentProps {
  value: string;
}

export class DropdownValueContent extends ValueObject<DropdownValueContentProps> {
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: DropdownValueContentProps) {
    super(props);
  }

  public static create(
    dropdownValueContent: string
  ): Result<DropdownValueContent> {
    const dropdownValueContentResult = Guard.againstNullOrUndefined(
      dropdownValueContent,
      "dropdownValueContent"
    );

    if (!dropdownValueContentResult.succeeded) {
      return Result.fail<DropdownValueContent>(
        dropdownValueContentResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      dropdownValueContent
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<DropdownValueContent>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<DropdownValueContent>(
      new DropdownValueContent({ value: dropdownValueContent })
    );
  }
}
