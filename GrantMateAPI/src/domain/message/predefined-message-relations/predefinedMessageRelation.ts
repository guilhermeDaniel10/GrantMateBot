import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { DropdownValue } from "../dropdown/dropdown-value/dropdownValue";
import { PredefinedMessage } from "../predefined-message-content/predefinedMessage";
import { PredefinedMessageRelationId } from "./predefinedMessageRelationId";

interface PredefinedMessageRelationProps {
  predefinedMessageA: PredefinedMessage | DropdownValue;
  predefinedMessageB: PredefinedMessage;
  predefinedMessageBOnCancel?: PredefinedMessage;
}

export class PredefinedMessageRelation extends AggregateRoot<PredefinedMessageRelationProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get predefinedMessageRelationId(): PredefinedMessageRelationId {
    return PredefinedMessageRelationId.caller(this.id);
  }

  get predefinedMessageA(): PredefinedMessage | DropdownValue {
    return this.props.predefinedMessageA;
  }

  get predefinedMessageB(): PredefinedMessage {
    return this.props.predefinedMessageB;
  }

  get predefinedMessageBOnCancel(): PredefinedMessage | undefined {
    return this.props.predefinedMessageBOnCancel;
  }

  private constructor(
    props: PredefinedMessageRelationProps,
    id?: UniqueEntityID
  ) {
    super(props, id);
  }

  public static create(
    props: PredefinedMessageRelationProps,
    id?: UniqueEntityID
  ): Result<PredefinedMessageRelation> {
    const guardedProps = [
      {
        argument: props.predefinedMessageA,
        argumentName: "predefinedMessageA",
      },
      {
        argument: props.predefinedMessageB,
        argumentName: "predefinedMessageB",
      },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<PredefinedMessageRelation>(guardResult.message || "");
    } else {
      const predefinedMessageRelation = new PredefinedMessageRelation(
        {
          ...props,
        },
        id
      );

      return Result.ok<PredefinedMessageRelation>(predefinedMessageRelation);
    }
  }
}
