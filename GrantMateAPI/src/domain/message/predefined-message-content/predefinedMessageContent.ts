import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface PredefinedMessageContentProps {
  value: string;
}

export class PredefinedMessageContent extends ValueObject<PredefinedMessageContentProps> {
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PredefinedMessageContentProps) {
    super(props);
  }

  public static create(
    predefinedMessageContent: string
  ): Result<PredefinedMessageContent> {
    const predefinedMessageContentResult = Guard.againstNullOrUndefined(
      predefinedMessageContent,
      "predefinedMessageContent"
    );

    if (!predefinedMessageContentResult.succeeded) {
      return Result.fail<PredefinedMessageContent>(
        predefinedMessageContentResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      predefinedMessageContent
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<PredefinedMessageContent>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<PredefinedMessageContent>(
      new PredefinedMessageContent({ value: predefinedMessageContent })
    );
  }
}
