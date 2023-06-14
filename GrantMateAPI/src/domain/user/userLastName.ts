import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface UserLastNameProps {
  value: string;
}

export class UserLastName extends ValueObject<UserLastNameProps> {
  public static maxLength: number = 50;
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserLastNameProps) {
    super(props);
  }

  public static create(lastName: string): Result<UserLastName> {
    const nameResult = Guard.againstNullOrUndefined(lastName, "lastName");

    if (!nameResult.succeeded) {
      return Result.fail<UserLastName>(nameResult.message || "");
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, lastName);
    if (!minLengthResult.succeeded) {
      return Result.fail<UserLastName>(minLengthResult.message || "");
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, lastName);
    if (!maxLengthResult.succeeded) {
      return Result.fail<UserLastName>(maxLengthResult.message || "");
    }

    return Result.ok<UserLastName>(new UserLastName({ value: lastName }));
  }
}
