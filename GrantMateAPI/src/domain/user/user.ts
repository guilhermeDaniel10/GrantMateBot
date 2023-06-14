import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { UserAddress } from "./userAddress";
import { UserEmail } from "./userEmail";
import { UserFirstName } from "./userFirstName";
import { UserId } from "./userId";
import { UserLastName } from "./userLastName";
import { UserPassword } from "./userPassword";

interface UserProps {
  firstName: UserFirstName;
  lastName: UserLastName;
  email: UserEmail;
  address: UserAddress;
  password: UserPassword;
}

export class User extends AggregateRoot<UserProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get userId(): UserId {
    return UserId.caller(this.id);
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get emailValue(): string {
    return this.email.value;
  }

  get address(): UserAddress {
    return this.props.address;
  }

  get firstName(): string {
    return this.props.firstName.value;
  }

  get lastName(): string {
    return this.props.lastName.value;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const guardedProps = [
      { argument: props.firstName, argumentName: "firstName" },
      { argument: props.lastName, argumentName: "lastName" },
      { argument: props.email, argumentName: "email" },
      { argument: props.address, argumentName: "address" },
      { argument: props.password, argumentName: "password" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message || '');
    } else {
      const user = new User(
        {
          ...props,
        },
        id
      );

      return Result.ok<User>(user);
    }
  }
}
