import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface PredefinedMessageFromBotProps {
  value: boolean;
}

export class PredefinedMessageFromBot extends ValueObject<PredefinedMessageFromBotProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: PredefinedMessageFromBotProps) {
    super(props);
  }

  public static create(
    predefinedMessageFromBot: boolean
  ): Result<PredefinedMessageFromBot> {
    const predefinedMessageFromBotResult = Guard.againstNullOrUndefined(
      predefinedMessageFromBot,
      "predefinedMessageFromBot"
    );

    if (!predefinedMessageFromBotResult.succeeded) {
      return Result.fail<PredefinedMessageFromBot>(
        predefinedMessageFromBotResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }
    return Result.ok<PredefinedMessageFromBot>(
      new PredefinedMessageFromBot({ value: predefinedMessageFromBot })
    );
  }
}
