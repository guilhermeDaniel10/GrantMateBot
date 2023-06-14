import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { PredefinedMessage } from "../predefined-message-content/predefinedMessage";
import { MessageContent } from "./messageContent";
import { MessageFromBot } from "./messageFromBot";
import { MessageId } from "./messageId";
import { MessageTimestamp } from "./messageTimestamp";

interface MessageProps {
  messageContent: MessageContent;
  messageFromBot: MessageFromBot;
  messageTimestamp: MessageTimestamp;
  predefinedMessage: PredefinedMessage;
}

export class Message extends AggregateRoot<MessageProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get messageId(): MessageId {
    return MessageId.caller(this.id);
  }

  get messageContent(): MessageContent {
    return this.props.messageContent;
  }

  get messageFromBot(): MessageFromBot {
    return this.props.messageFromBot;
  }

  get messageTimestamp(): MessageTimestamp {
    return this.props.messageTimestamp;
  }

  get predefinedMessage(): PredefinedMessage {
    return this.props.predefinedMessage;
  }

  public static create(
    props: MessageProps,
    id?: UniqueEntityID
  ): Result<Message> {
    const guardedProps = [
      {
        argument: props.messageContent,
        argumentName: "messageContent",
      },
      {
        argument: props.messageFromBot,
        argumentName: "messageFromBot",
      },
      {
        argument: props.messageTimestamp,
        argumentName: "messageTimestamp",
      },
      {
        argument: props.predefinedMessage,
        argumentName: "predefinedMessage",
      },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<Message>(guardResult.message || "");
    } else {
      const message = new Message(
        {
          ...props,
        },
        id
      );

      return Result.ok<Message>(message);
    }
  }
}
