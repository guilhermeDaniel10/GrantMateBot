import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { FileAccessLevels } from "./fileAccessLevel";
import { FileDescription } from "./fileDescription";
import { FileExtension } from "./fileExtension";
import { FileGPTTrained } from "./fileGPTTrained";
import { FileId } from "./fileId";
import { FileName } from "./fileName";
import { FileSize } from "./fileSize";

interface FileProps {
  filename: FileName;
  description: FileDescription;
  size: FileSize;
  extension: FileExtension;
  accessLevel: FileAccessLevels;
  gptTrained: FileGPTTrained;
}

export class File extends AggregateRoot<FileProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get fileId(): FileId {
    return FileId.caller(this.id);
  }

  get filename(): FileName {
    return this.props.filename;
  }

  get description(): FileDescription {
    return this.props.description;
  }

  get size(): FileSize {
    return this.props.size;
  }

  get extension(): FileExtension {
    return this.props.extension;
  }

  get accessLevels(): FileAccessLevels {
    return this.props.accessLevel;
  }

  get gptTrained(): FileGPTTrained {
    return this.props.gptTrained;
  }

  private constructor(props: FileProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: FileProps, id?: UniqueEntityID): Result<File> {
    const guardedProps = [
      { argument: props.filename, argumentName: "filename" },
      { argument: props.description, argumentName: "description" },
      { argument: props.size, argumentName: "size" },
      { argument: props.extension, argumentName: "extension" },
      { argument: props.gptTrained, argumentName: "gptTrained" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<File>(guardResult.message || "");
    } else {
      const file = new File(
        {
          ...props,
        },
        id
      );

      return Result.ok<File>(file);
    }
  }
}
