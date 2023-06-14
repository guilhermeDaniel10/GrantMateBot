import { AggregateRoot } from "../../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../../core/domain/UniqueEntityID";
import { Guard } from "../../../../core/logic/Guard";
import { Result } from "../../../../core/logic/Result";
import { Bold } from "./bold";
import { Caps } from "./caps";
import { Color } from "./color";
import { TitleFomatId } from "./titleFormatId";

interface TitleFormatProps {
  bold: Bold;
  caps: Caps;
  color: Color;
}

export class TitleFormat extends AggregateRoot<TitleFormatProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get titleFormatId(): TitleFomatId {
    return TitleFomatId.caller(this.id);
  }

  get bold(): Bold {
    return this.props.bold;
  }

  get caps(): Caps {
    return this.props.caps;
  }

  get color(): Color {
    return this.props.color;
  }

  private constructor(props: TitleFormatProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: TitleFormatProps,
    id?: UniqueEntityID
  ): Result<TitleFormat> {
    const guardedProps = [
      { argument: props.bold, argumentName: "bold" },
      { argument: props.caps, argumentName: "caps" },
      { argument: props.color, argumentName: "color" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<TitleFormat>(guardResult.message || "");
    } else {
      const titleFormat = new TitleFormat(
        {
          ...props,
        },
        id
      );

      return Result.ok<TitleFormat>(titleFormat);
    }
  }
}
