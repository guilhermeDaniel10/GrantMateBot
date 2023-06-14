import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface MessageContentProps {
  value: string;
}

export class MessageContent extends ValueObject<MessageContentProps> {
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: MessageContentProps) {
    super(props);
  }

  public static create(
    messageContent: string
  ): Result<MessageContent> {
    const messageContentResult = Guard.againstNullOrUndefined(
        messageContent,
      "messageContent"
    );

    if (!messageContentResult.succeeded) {
      return Result.fail<MessageContent>(
        messageContentResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      messageContent
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<MessageContent>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<MessageContent>(
      new MessageContent({ value: messageContent })
    );
  }
}
