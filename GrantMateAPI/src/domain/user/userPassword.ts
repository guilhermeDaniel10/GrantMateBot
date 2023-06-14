import { ValueObject } from "../../core/domain/ValueObject";
import * as bcrypt from "bcrypt";
import { Result } from "../../core/logic/Result";
import { Guard } from "../../core/logic/Guard";
import { EncryptUtils } from "../../utils/EncryptUtil";
import { StatusCodes } from "http-status-codes";

export interface IUserPasswordProps {
  value: string;
  hashed?: boolean;
}

export class UserPassword extends ValueObject<IUserPasswordProps> {
  public static minLength: number = 6;

  get value(): string {
    return this.props.value;
  }

  get getValue(): string {
    return this.props.value;
  }

  set passwordPropsValue(hashedPassword: string) {
    this.props.value = hashedPassword;
  }

  private constructor(props: IUserPasswordProps) {
    super(props);
  }

  private static isAppropriateLength(password: string): boolean {
    return password.length >= this.minLength;
  }

  public isAlreadyHashed(): boolean | undefined {
    return this.props.hashed;
  }

  /**
   * @method comparePassword
   * @desc Compares as plain-text and hashed password.
   */

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    return await EncryptUtils.comparePassword(
      plainTextPassword,
      this.props.value
    );
  }

  public static async create(
    props: IUserPasswordProps
  ): Promise<Result<UserPassword>> {
    const propsResult = Guard.againstNullOrUndefined(props.value, "password");

    if (!propsResult.succeeded) {
      return Result.fail<UserPassword>(propsResult.message || "");
    }

    if (props.hashed) {
      return Result.ok<UserPassword>(
        new UserPassword({
          value: props.value,
          hashed: true,
        })
      );
    }

    if (!this.isAppropriateLength(props.value)) {
      return Result.fail<UserPassword>(
        "Password doesnt meet criteria [8 chars min].",
        StatusCodes.UNPROCESSABLE_ENTITY
      );
    }
    const hashedPassword = await EncryptUtils.hashPassword(props.value);

    return Result.ok<UserPassword>(
      new UserPassword({
        value: hashedPassword,
        hashed: true,
      })
    );
  }
}
