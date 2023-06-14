import { ValueObject } from "../../../../core/domain/ValueObject";
import { Guard } from "../../../../core/logic/Guard";
import { Result } from "../../../../core/logic/Result";

interface BoldProps {
  value: boolean;
}

export class Bold extends ValueObject<BoldProps> {
  get value(): boolean {
    return this.props.value;
  }

  private constructor(props: BoldProps) {
    super(props);
  }

  public static create(bold: boolean): Result<Bold> {
    const boldResult = Guard.againstNullOrUndefined(bold, "bold");

    if (!boldResult.succeeded) {
      return Result.fail<Bold>("Invalid bold value");
    }

    return Result.ok<Bold>(new Bold({ value: bold }));
  }
}
