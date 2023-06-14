import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface FileDescriptionProps {
  value: string;
}

export class FileDescription extends ValueObject<FileDescriptionProps> {
  public static maxLength: number = 500;
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: FileDescriptionProps) {
    super(props);
  }

  public static create(fileDescription: string): Result<FileDescription> {
    const fileResult = Guard.againstNullOrUndefined(
      fileDescription,
      "fileDescription"
    );

    if (!fileResult.succeeded) {
      return Result.fail<FileDescription>(fileResult.message || "");
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      fileDescription
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<FileDescription>(minLengthResult.message || "");
    }

    const maxLengthResult = Guard.againstAtMost(
      this.maxLength,
      fileDescription
    );
    if (!maxLengthResult.succeeded) {
      return Result.fail<FileDescription>(maxLengthResult.message || "");
    }

    return Result.ok<FileDescription>(
      new FileDescription({ value: fileDescription })
    );
  }
}
