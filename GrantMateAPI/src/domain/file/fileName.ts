import { StatusCodes } from "http-status-codes";
import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface FileNameProps {
  value: string;
}

export class FileName extends ValueObject<FileNameProps> {
  public static maxLength: number = 255;
  public static minLength: number = 1;

  static readonly INVALID_CHARS = ["^", "*", "$", "@", "#", "%", "&", "+"];

  get value(): string {
    return this.props.value;
  }

  private constructor(props: FileNameProps) {
    super(props);
  }

  public static create(fileName: string): Result<FileName> {
    const nameResult = Guard.againstNullOrUndefined(fileName, "fileName");

    if (!nameResult.succeeded) {
      return Result.fail<FileName>(
        nameResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, fileName);
    if (!minLengthResult.succeeded) {
      return Result.fail<FileName>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, fileName);
    if (!maxLengthResult.succeeded) {
      return Result.fail<FileName>(
        maxLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const containsInvalidChars = Guard.containsAllChars(
      fileName,
      this.INVALID_CHARS,
      fileName
    );
    if (containsInvalidChars.succeeded) {
      return Result.fail<FileName>(
        containsInvalidChars.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<FileName>(new FileName({ value: fileName }));
  }
}
