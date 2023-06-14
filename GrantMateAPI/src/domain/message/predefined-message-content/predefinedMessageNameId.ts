import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface PredefinedMessageNameIdProps {
  value: string;
}

export class PredefinedMessageNameId extends ValueObject<PredefinedMessageNameIdProps> {
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PredefinedMessageNameIdProps) {
    super(props);
  }

  public static create(
    predefinedMessageNameId: string
  ): Result<PredefinedMessageNameId> {
    const predefinedMessageNameIdResult = Guard.againstNullOrUndefined(
      predefinedMessageNameId,
      "predefinedMessageNameId"
    );

    if (!predefinedMessageNameIdResult.succeeded) {
      return Result.fail<PredefinedMessageNameId>(
        predefinedMessageNameIdResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      predefinedMessageNameId
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<PredefinedMessageNameId>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<PredefinedMessageNameId>(
      new PredefinedMessageNameId({ value: predefinedMessageNameId })
    );
  }
}
