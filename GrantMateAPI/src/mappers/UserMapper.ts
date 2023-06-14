import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DTO } from "../core/infra/DTO";
import { Mapper } from "../core/infra/Mapper";
import { Result } from "../core/logic/Result";
import { User } from "../domain/user/user";
import { UserAddress } from "../domain/user/userAddress";
import { UserEmail } from "../domain/user/userEmail";
import { UserFirstName } from "../domain/user/userFirstName";
import { UserLastName } from "../domain/user/userLastName";
import { UserPassword } from "../domain/user/userPassword";
import { IUserDTO } from "../dto/IUserDTO";

export class UserMapper /*implements Mapper<User>*/ {
  public static async toDomain(raw: any): Promise<User> {
    const userEmailOrError = UserEmail.create(raw.email);
    const userPasswordOrError = await UserPassword.create({
      value: raw.password,
      hashed: true,
    });
    const firstNameOrError = UserFirstName.create(raw.firstName);
    const lastNameOrError = UserLastName.create(raw.lastName);
    const addressOrError = UserAddress.create(raw.address);

    const dtoResult = Result.combine([
      firstNameOrError,
      lastNameOrError,
      userPasswordOrError,
      userEmailOrError,
      userPasswordOrError,
      addressOrError,
    ]);

    dtoResult.isFailure ? console.log(dtoResult.error) : "";


    const userOrError = User.create(
      {
        firstName: firstNameOrError.getValue(),
        lastName: lastNameOrError.getValue(),
        address: addressOrError.getValue(),
        email: userEmailOrError.getValue(),
        password: userPasswordOrError.getValue(),
      },
      new UniqueEntityID(raw.domainId)
    );


    if (userOrError.isFailure) {
      throw new Error(userOrError.error.toString());
    }

    return userOrError.getValue();
  }
  public static toDTO(user: User): DTO {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email.value,
      address: user.address.value
    } as IUserDTO;
  }
  public static toPersistence(user: User): any {
    const userPersistence = {
      domainId: user.id.toString(),
      email: user.email.value,
      password: user.password.value,
      address: user.address.value,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return userPersistence;
  }
}
