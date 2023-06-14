import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { Dropdown } from "../dropdown/dropdown";
import { ServiceCall } from "../service-call/serviceCall";
import { PredefinedMessageContent } from "./predefinedMessageContent";
import { PredefinedMessageFromBot } from "./predefinedMessageFromBot";
import { PredefinedMessageId } from "./predefinedMessageId";
import { PredefinedMessageNameId } from "./predefinedMessageNameId";

interface PredefinedMessageProps {
  dbId?: number;
  predefinedMessageContent: PredefinedMessageContent;
  predefinedMessageFromBot: PredefinedMessageFromBot;
  predefinedMessageNameId: PredefinedMessageNameId;
  selectable?: boolean;
  customizable?: boolean;
  dropdown?: Dropdown;
  serviceCall?: ServiceCall;
  openField?: boolean;
  canCancel?: boolean;
}

export class PredefinedMessage extends AggregateRoot<PredefinedMessageProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get dbId(): number | undefined {
    return this.props.dbId;
  }

  get predefinedMessageId(): PredefinedMessageId {
    return PredefinedMessageId.caller(this.id);
  }

  get predefinedMessageContent(): PredefinedMessageContent {
    return this.props.predefinedMessageContent;
  }

  get predefinedMessageFromBot(): PredefinedMessageFromBot {
    return this.props.predefinedMessageFromBot;
  }

  get predefinedMessageNameId(): PredefinedMessageNameId {
    return this.props.predefinedMessageNameId;
  }

  get selectable(): boolean | undefined {
    return this.props.selectable;
  }

  get customizable(): boolean | undefined {
    return this.props.customizable;
  }

  get dropdown(): Dropdown | undefined {
    return this.props.dropdown;
  }

  get serviceCall(): ServiceCall | undefined {
    return this.props.serviceCall;
  }

  get openField(): boolean | undefined {
    return this.props.openField;
  }

  get canCancel(): boolean | undefined {
    return this.props.canCancel;
  }

  private constructor(props: PredefinedMessageProps, id?: UniqueEntityID) {
    super(props, id);
  }

  set dropdown(dropdown: Dropdown | undefined) {
    this.props.dropdown = dropdown;
  }

  set serviceCall(serviceCall: ServiceCall | undefined) {
    this.props.serviceCall = serviceCall;
  }

  public static create(
    props: PredefinedMessageProps,
    id?: UniqueEntityID
  ): Result<PredefinedMessage> {
    const guardedProps = [
      {
        argument: props.predefinedMessageContent,
        argumentName: "predefinedMessageContent",
      },
      {
        argument: props.predefinedMessageFromBot,
        argumentName: "predefinedMessageFromBot",
      },
      {
        argument: props.predefinedMessageNameId,
        argumentName: "predefinedMessageNameId",
      },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<PredefinedMessage>(guardResult.message || "");
    } else {
      const predefinedMessage = new PredefinedMessage(
        {
          ...props,
        },
        id
      );

      return Result.ok<PredefinedMessage>(predefinedMessage);
    }
  }
}
