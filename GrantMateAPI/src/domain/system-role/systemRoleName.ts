import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface SystemRoleNameProps {
  value: string;
}

export class SystemRoleName extends ValueObject<SystemRoleNameProps> {
  public static maxLength: number = 50;
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: SystemRoleNameProps) {
    super(props);
  }

  public static create(systemRoleName: string): Result<SystemRoleName> {
    const roleTypeResult = Guard.againstNullOrUndefined(systemRoleName, "systemRoleName");

    if (!roleTypeResult.succeeded) {
      return Result.fail<SystemRoleName>(roleTypeResult.message || "");
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, systemRoleName);
    if (!minLengthResult.succeeded) {
      return Result.fail<SystemRoleName>(minLengthResult.message || "");
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, systemRoleName);
    if (!maxLengthResult.succeeded) {
      return Result.fail<SystemRoleName>(maxLengthResult.message || "");
    }

    return Result.ok<SystemRoleName>(new SystemRoleName({ value: systemRoleName }));
  }
}
