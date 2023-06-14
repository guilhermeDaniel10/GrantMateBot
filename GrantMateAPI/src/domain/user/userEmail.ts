import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface UserEmailProps {
  value: string;
}

export class UserEmail extends ValueObject<UserEmailProps> {
  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserEmailProps) {
    super(props);
  }

  public static create(email: string): Result<UserEmail> {
    const guardResult = Guard.againstNullOrUndefined(email, "email");
    if (!guardResult.succeeded) {
      return Result.fail<UserEmail>(guardResult.message || "");
    } else {
      if (!this.validateEmail(email)) {
        return Result.fail<UserEmail>("Email is not valid");
      }
      return Result.ok<UserEmail>(new UserEmail({ value: email }));
    }
  }

  public static validateEmail(email: string): boolean {
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
  }
}
