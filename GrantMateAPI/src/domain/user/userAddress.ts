import { ValueObject } from "../../core/domain/ValueObject";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";

interface UserAddressProps {
  value: string;
}

export class UserAddress extends ValueObject<UserAddressProps> {
  public static maxLength: number = 50;
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: UserAddressProps) {
    super(props);
  }

  public static create(address: string): Result<UserAddress> {
    const addressResult = Guard.againstNullOrUndefined(address, "address");

    if (!addressResult.succeeded) {
      return Result.fail<UserAddress>(addressResult.message || "");
    }

    const minLengthResult = Guard.againstAtLeast(this.minLength, address);
    if (!minLengthResult.succeeded) {
      return Result.fail<UserAddress>(minLengthResult.message || "");
    }

    const maxLengthResult = Guard.againstAtMost(this.maxLength, address);
    if (!maxLengthResult.succeeded) {
      return Result.fail<UserAddress>(maxLengthResult.message || "");
    }

    return Result.ok<UserAddress>(new UserAddress({ value: address }));
  }
}
