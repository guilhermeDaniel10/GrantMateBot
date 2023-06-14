// Todo: finish the implementationimport { ValueObject } from "../../../core/domain/ValueObject";
import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface MessageFromBotProps {
  value: boolean;
}

export class MessageFromBot extends ValueObject<MessageFromBotProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: MessageFromBotProps) {
    super(props);
  }

  public static create(messageFromBot: boolean): Result<MessageFromBot> {
    const messageFromBotResult = Guard.againstNullOrUndefined(
      messageFromBot,
      "messageFromBot"
    );

    if (!messageFromBotResult.succeeded) {
      return Result.fail<MessageFromBot>(
        messageFromBotResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }
    return Result.ok<MessageFromBot>(
      new MessageFromBot({ value: messageFromBot })
    );
  }
}
