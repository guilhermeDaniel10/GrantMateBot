import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface PredefinedMessageSelectableProps {
  value: boolean;
}

export class PredefinedMessageSelectable extends ValueObject<PredefinedMessageSelectableProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: PredefinedMessageSelectableProps) {
    super(props);
  }

  public static create(
    predefinedMessageSelectable: boolean
  ): Result<PredefinedMessageSelectable> {
    const predefinedMessageSelectableResult = Guard.againstNullOrUndefined(
      predefinedMessageSelectable,
      "predefinedMessageSelectable"
    );

    if (!predefinedMessageSelectableResult.succeeded) {
      return Result.fail<PredefinedMessageSelectable>(
        predefinedMessageSelectableResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }
    return Result.ok<PredefinedMessageSelectable>(
      new PredefinedMessageSelectable({ value: predefinedMessageSelectable })
    );
  }
}
