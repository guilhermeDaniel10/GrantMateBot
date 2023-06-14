import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface TrainingDatasetSizeProps {
  value: number;
}

export class TrainingDatasetSize extends ValueObject<TrainingDatasetSizeProps> {
  get value(): number {
    return this.props.value;
  }

  private constructor(props: TrainingDatasetSizeProps) {
    super(props);
  }

  public static create(
    traningDatasetSize: number
  ): Result<TrainingDatasetSize> {
    const trainingDatasetSizeResult = Guard.againstNullOrUndefined(
      traningDatasetSize,
      "traningDatasetSize"
    );

    if (!trainingDatasetSizeResult.succeeded) {
      return Result.fail<TrainingDatasetSize>(
        trainingDatasetSizeResult.message || ""
      );
    }

    return Result.ok<TrainingDatasetSize>(
      new TrainingDatasetSize({ value: traningDatasetSize })
    );
  }
}
