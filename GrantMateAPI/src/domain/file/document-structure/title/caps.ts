import { ValueObject } from "../../../../core/domain/ValueObject";
import { Guard } from "../../../../core/logic/Guard";
import { Result } from "../../../../core/logic/Result";

interface CapsProps {
  value: boolean;
}

export class Caps extends ValueObject<CapsProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: CapsProps) {
    super(props);
  }

  public static create(caps: boolean): Result<Caps> {
    const boldResult = Guard.againstNullOrUndefined(caps, "caps");

    if (!boldResult.succeeded) {
      return Result.fail<Caps>("Invalid caps value");
    }

    return Result.ok<Caps>(new Caps({ value: caps }));
  }
}
