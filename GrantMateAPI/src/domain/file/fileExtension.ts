import { StatusCodes } from "http-status-codes";
import * as path from "path";
import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface FileExtensionProps {
  value: string;
}

export class FileExtension extends ValueObject<FileExtensionProps> {
  static readonly ACCEPTABLE_EXTENSIONS = [
    ".pdf",
    ".docx",
    ".txt",
    ".csv",
    ".xlsx",
    ".xls",
    ".ods",
  ];

  get value(): string {
    return this.props.value;
  }

  private constructor(props: FileExtensionProps) {
    super(props);
  }

  public static create(fileName: string): Result<FileExtension> {
    const nameResult = Guard.againstNullOrUndefined(
      fileName,
      "fileNameExtension"
    );

    if (!nameResult.succeeded) {
      return Result.fail<FileExtension>(
        nameResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }
    const fileExtension = this.getFileExtension(fileName);

    if (fileExtension == "") {
      return Result.fail<FileExtension>(
        "No Extension" || "",
        StatusCodes.FORBIDDEN
      );
    }

    const extensionTypeResult = Guard.isOneOf(
      fileExtension,
      this.ACCEPTABLE_EXTENSIONS,
      "fileExtension"
    );
    if (!extensionTypeResult.succeeded) {
      return Result.fail<FileExtension>(
        extensionTypeResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<FileExtension>(
      new FileExtension({ value: fileExtension })
    );
  }

  public static getFileExtension(filename: string): string {
    return path.extname(filename).toLowerCase();
  }
}
