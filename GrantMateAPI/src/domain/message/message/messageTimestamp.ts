import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface MessageTimestampProps {
  value: Date;
}

export class MessageTimestamp extends ValueObject<MessageTimestampProps> {
  get value(): Date {
    return this.props.value;
  }

  private constructor(props: MessageTimestampProps) {
    super(props);
  }

  public static create(messageTimestamp: Date): Result<MessageTimestamp> {
    const messageTimestampResult = Guard.againstNullOrUndefined(
      messageTimestamp,
      "messageTimestamp"
    );

    if (!messageTimestampResult.succeeded) {
      return Result.fail<MessageTimestamp>(
        messageTimestampResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }
    return Result.ok<MessageTimestamp>(
      new MessageTimestamp({ value: messageTimestamp })
    );
  }
}
