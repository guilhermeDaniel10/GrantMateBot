import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface UserFirstNameProps {
  value: string;
}

export class UserFirstName extends ValueObject<UserFirstNameProps> {
  public static maxLength: number = 50;
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserFirstNameProps) {
    super(props);
  }

  public static create(firstName: string): Result<UserFirstName> {
    const nameResult = Guard.againstNullOrUndefined(firstName, "firstName");

    if (!nameResult.succeeded) {
      return Result.fail<UserFirstName>(nameResult.message || "");
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, firstName);
    if (!minLengthResult.succeeded) {
      return Result.fail<UserFirstName>(minLengthResult.message || "");
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, firstName);
    if (!maxLengthResult.succeeded) {
      return Result.fail<UserFirstName>(maxLengthResult.message || "");
    }

    return Result.ok<UserFirstName>(new UserFirstName({ value: firstName }));
  }
}
