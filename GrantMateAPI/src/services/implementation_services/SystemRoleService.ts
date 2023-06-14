import { Inject, Service } from "typedi";
import ISystemRoleService from "../interface_services/ISystemRoleService";
import { Result } from "../../core/logic/Result";
import { ISystemRoleDTO } from "../../dto/ISystemRoleDTO";
import config from "../../config";
import ISystemRoleRepo from "../../repositories/interface_repositories/ISystemRoleRepo";
import { StatusCodes } from "http-status-codes";
import { SystemRoleName } from "../../domain/system-role/systemRoleName";
import { SystemRole } from "../../domain/system-role/systemRole";
import { SystemRoleMapper } from "../../mappers/SystemRoleMapper";

@Service()
export default class SystemRoleService implements ISystemRoleService {
  constructor(
    @Inject(config.repos.systemRole.name)
    private systemRoleRepo: ISystemRoleRepo
  ) {}
  async create(systemRoleDTO: ISystemRoleDTO): Promise<Result<ISystemRoleDTO>> {
    try {
      const foundSystemRole = await this.systemRoleRepo.findBySystemRoleName(
        systemRoleDTO.systemRoleName
      );

      const found = !!foundSystemRole;
      if (found) {
        return Result.fail<ISystemRoleDTO>(
          "System Role already exists with name=" +
            systemRoleDTO.systemRoleName,
          StatusCodes.CONFLICT
        );
      }

      const systemRoleName = await SystemRoleName.create(
        systemRoleDTO.systemRoleName
      );

      const systemRoleOrError = await SystemRole.create({
        systemRoleName: systemRoleName.getValue(),
      });

      if (systemRoleOrError.isFailure) {
        throw Result.fail<SystemRole>(
          systemRoleOrError.getErrorValue(),
          StatusCodes.FORBIDDEN
        );
      }

      const systemRoleResult = systemRoleOrError.getValue();

      await this.systemRoleRepo.save(systemRoleResult);
      const systemRoleDTOResult = SystemRoleMapper.toDTO(
        systemRoleResult
      ) as ISystemRoleDTO;
      return Result.ok<ISystemRoleDTO>(systemRoleDTOResult);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async findSystemRoleByname(
    systemRoleDTO: ISystemRoleDTO
  ): Promise<Result<ISystemRoleDTO>> {
    try {
      const foundSystemRole = await this.systemRoleRepo.findBySystemRoleName(
        systemRoleDTO.systemRoleName
      );

      const found = !!foundSystemRole;
      if (!found) {
        return Result.fail<ISystemRoleDTO>(
          "System Role not found with name=" + systemRoleDTO.systemRoleName,
          StatusCodes.NOT_FOUND
        );
      }

      const systemRoleDTOResult = SystemRoleMapper.toDTO(
        foundSystemRole
      ) as ISystemRoleDTO;
      return Result.ok<ISystemRoleDTO>(systemRoleDTOResult);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
