import { StatusCodes } from "http-status-codes";
import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface TrainingDatasetNameProps {
  value: string;
}

export class TrainingDatasetName extends ValueObject<TrainingDatasetNameProps> {
  public static maxLength: number = 255;
  public static minLength: number = 1;

  static readonly INVALID_CHARS = ["^", "*", "$", "@", "#", "%", "&", "+"];
  static readonly STRUCTURE_FILE_NAME = "structure";

  get value(): string {
    return this.props.value;
  }

  private constructor(props: TrainingDatasetNameProps) {
    super(props);
  }

  public static create(
    traningDatasetName: string
  ): Result<TrainingDatasetName> {
    const nameResult = Guard.againstNullOrUndefined(
      traningDatasetName,
      "traningDatasetName"
    );

    if (!nameResult.succeeded) {
      return Result.fail<TrainingDatasetName>(
        nameResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      traningDatasetName
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<TrainingDatasetName>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const maxLengthResult = Guard.againstAtMost(
      this.maxLength,
      traningDatasetName
    );
    if (!maxLengthResult.succeeded) {
      return Result.fail<TrainingDatasetName>(
        maxLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const containsInvalidChars = Guard.containsAllChars(
      traningDatasetName,
      this.INVALID_CHARS,
      traningDatasetName
    );
    if (containsInvalidChars.succeeded) {
      return Result.fail<TrainingDatasetName>(
        containsInvalidChars.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const containsStructureName = traningDatasetName.includes(
      this.STRUCTURE_FILE_NAME
    );
    if (!containsStructureName) {
      return Result.fail<TrainingDatasetName>(
        "Training dataset name must contain 'structure' string",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<TrainingDatasetName>(
      new TrainingDatasetName({ value: traningDatasetName })
    );
  }
}
