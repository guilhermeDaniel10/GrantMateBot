import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface FileSizeProps {
  value: number;
}

export class FileSize extends ValueObject<FileSizeProps> {
  //public static maxFileSize = 100;

  get value(): number {
    return this.props.value;
  }

  private constructor(props: FileSizeProps) {
    super(props);
  }

  public static create(fileSize: number): Result<FileSize> {
    const extensionResult = Guard.againstNullOrUndefined(fileSize, "fileSize");

    if (!extensionResult.succeeded) {
      return Result.fail<FileSize>(extensionResult.message || "");
    }

    /* const maxLengthResult = Guard.smallerThan(this.maxFileSize, fileSize);
    if (!maxLengthResult.succeeded) {
      return Result.fail<FileSize>(maxLengthResult.message || "");
    }*/

    return Result.ok<FileSize>(new FileSize({ value: fileSize }));
  }
}
