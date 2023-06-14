import { Inject, Service } from "typedi";
import IUserService from "../interface_services/IUserService";
import { Result } from "../../core/logic/Result";
import { IUserDTO } from "../../dto/IUserDTO";
import config from "../../config";
import IUserRepo from "../../repositories/interface_repositories/IUserRepo";
import { UserFirstName } from "../../domain/user/userFirstName";
import { UserLastName } from "../../domain/user/userLastName";
import { UserEmail } from "../../domain/user/userEmail";
import { UserPassword } from "../../domain/user/userPassword";
const jwt = require("jsonwebtoken");
import { UserAddress } from "../../domain/user/userAddress";
import { User } from "../../domain/user/user";
import { UserMapper } from "../../mappers/UserMapper";
import { StatusCodes } from "http-status-codes";
import { EncryptUtils } from "../../utils/EncryptUtil";
import { IUserLoginDTO } from "../../dto/IUserLoginDTO";
var bcrypt = require("bcrypt");

@Service()
export default class UserService implements IUserService {
  constructor(@Inject(config.repos.user.name) private userRepo: IUserRepo) {}

  async signUp(userDTO: IUserDTO): Promise<Result<IUserDTO>> {
    try {
      const foundUser = await this.userRepo.findByEmail(userDTO.email);

      const found = !!foundUser;
      if (found) {
        return Result.fail<IUserDTO>(
          "User already exists with email=" + userDTO.email,
          StatusCodes.CONFLICT
        );
      }

      const firstName = await UserFirstName.create(userDTO.firstName);
      const lastName = await UserLastName.create(userDTO.lastName);
      const email = await UserEmail.create(userDTO.email);
      const password = await UserPassword.create({
        value: userDTO.password,
        hashed: false,
      });
      const address = await UserAddress.create(userDTO.address);

      const userOrError = await User.create({
        firstName: firstName.getValue(),
        lastName: lastName.getValue(),
        email: email.getValue(),
        address: address.getValue(),
        password: password.getValue(),
      });

      if (userOrError.isFailure) {
        throw Result.fail<User>(
          userOrError.getErrorValue(),
          StatusCodes.FORBIDDEN
        );
      }

      const userResult = userOrError.getValue();

      console.log("Generating JWT");
      const token = this.generateToken(userResult);

      await this.userRepo.save(userResult);
      const userDTOResult = UserMapper.toDTO(userResult) as IUserDTO;
      return Result.ok<IUserDTO>(userDTOResult);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  public async signIn(
    userLoginDTO: IUserLoginDTO
  ): Promise<Result<{ userDTO: IUserDTO; token: string }>> {
    const user = await this.userRepo.findByEmail(userLoginDTO.email);

    if (!user) {
      throw Result.fail<User>("User not found", StatusCodes.NOT_FOUND);
    }

    const isValidPassword = await EncryptUtils.comparePassword(
      userLoginDTO.password,
      user.password.getValue
    );

    if (isValidPassword) {
      console.log("Password is valid!");
      console.log("Generating JWT");
      const token = this.generateToken(user) as string;
      const userDTO = UserMapper.toDTO(user) as IUserDTO;
      return Result.ok<{ userDTO: IUserDTO; token: string }>({
        userDTO: userDTO,
        token: token,
      });
    } else {
      throw Result.fail<User>("Invalid password", StatusCodes.UNAUTHORIZED);
    }
  }

  private generateToken(user: User) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    const id = user.id.toString();
    const email = user.email.value;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const address = user.address.value;
    const password = user.password.value;

    return jwt.sign(
      {
        id: id,
        email: email,
        firstName: firstName,
        lastName: lastName,
        address: address,
        password: password,
        exp: exp.getTime() / 1000,
      },
      config.jwtSecret
    );
  }
}
