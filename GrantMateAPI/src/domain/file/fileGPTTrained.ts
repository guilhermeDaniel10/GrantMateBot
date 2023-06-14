import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface FileGPTTrainerProps {
  value: boolean;
}

export class FileGPTTrained extends ValueObject<FileGPTTrainerProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: FileGPTTrainerProps) {
    super(props);
  }

  public static create(fileGPTTrained: boolean): Result<FileGPTTrained> {
    const gptTrainedResult = Guard.againstNullOrUndefined(
      fileGPTTrained,
      "fileGPTTrained"
    );

    if (!gptTrainedResult.succeeded) {
      return Result.fail<FileGPTTrained>(gptTrainedResult.message || "");
    }

    return Result.ok<FileGPTTrained>(
      new FileGPTTrained({ value: fileGPTTrained })
    );
  }
}
