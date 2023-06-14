import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface FileAccessLevelProprs {
  value: string;
}

export class FileAccessLevels extends ValueObject<FileAccessLevelProprs> {
  static readonly ACCEPTABLE_LEVELS = ["PRIVATE", "PUBLIC"];

  get value(): string {
    return this.props.value;
  }

  private constructor(props: FileAccessLevelProprs) {
    super(props);
  }

  public static create(fileAccessLevel: string): Result<FileAccessLevels> {
    const accessResult = Guard.againstNullOrUndefined(
      fileAccessLevel,
      "fileAccessLevel"
    );

    if (!accessResult.succeeded) {
      return Result.fail<FileAccessLevels>(accessResult.message || "");
    }

    const extensionTypeResult = Guard.isOneOf(
      fileAccessLevel,
      this.ACCEPTABLE_LEVELS,
      "fileAccessLevel"
    );
    if (!extensionTypeResult.succeeded) {
      return Result.fail<FileAccessLevels>(extensionTypeResult.message || "");
    }

    return Result.ok<FileAccessLevels>(
      new FileAccessLevels({ value: fileAccessLevel })
    );
  }
}
