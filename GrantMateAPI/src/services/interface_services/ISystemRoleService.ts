import { Result } from "../../core/logic/Result";
import { ISystemRoleDTO } from "../../dto/ISystemRoleDTO";
import { IUserDTO } from "../../dto/IUserDTO";
import { IUserLoginDTO } from "../../dto/IUserLoginDTO";

export default interface ISystemRoleService {
  create(systemRoleDTO: ISystemRoleDTO): Promise<Result<ISystemRoleDTO>>;
  findSystemRoleByname(
    systemRoleDTO: ISystemRoleDTO
  ): Promise<Result<ISystemRoleDTO>>;
}
