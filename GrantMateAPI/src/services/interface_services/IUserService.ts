import { Result } from "../../core/logic/Result";
import { IUserDTO } from "../../dto/IUserDTO";
import { IUserLoginDTO } from "../../dto/IUserLoginDTO";

export default interface IUserService {
  signUp(userDTO: IUserDTO): Promise<Result<IUserDTO>>;
  signIn(
    userLoginDTO: IUserLoginDTO
  ): Promise<Result<{ userDTO: IUserDTO; token: string }>>;
}
