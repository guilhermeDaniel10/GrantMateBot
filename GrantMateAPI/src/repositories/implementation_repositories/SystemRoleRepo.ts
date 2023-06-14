import { Service } from "typedi";
import ISystemRoleRepo from "../interface_repositories/ISystemRoleRepo";
import { SystemRole } from "../../domain/system-role/systemRole";
import { SystemRoleName } from "../../domain/system-role/systemRoleName";
import { SystemRoleSchema } from "../../sequelize_schemas/SystemRoleSchema";
import { SystemRoleMapper } from "../../mappers/SystemRoleMapper";

@Service()
export default class SystemRoleRepo implements ISystemRoleRepo {
  async exists(systemRoleName: any): Promise<boolean> {
    const wantedSystemRoleName =
      systemRoleName instanceof SystemRoleName
        ? (<SystemRoleName>systemRoleName).value
        : systemRoleName;
    const wantedSystemRole = await SystemRoleSchema.findOne({
      where: { systemRoleName: wantedSystemRoleName },
    });

    return !!wantedSystemRole === true;
  }

  async findBySystemRoleName(
    systemRoleName: string | SystemRoleName
  ): Promise<SystemRole | null> {
    const wanterSystemRoleName =
      systemRoleName instanceof SystemRoleName
        ? (<SystemRoleName>systemRoleName).value
        : systemRoleName;
    const wantedSystemRole = await SystemRoleSchema.findOne({
      where: { systemRoleName: wanterSystemRoleName },
    });

    if (wantedSystemRole != null) {
      return SystemRoleMapper.toDomain(wantedSystemRole);
    }
    return null;
  }

  async save(systemRole: SystemRole): Promise<SystemRole> {
    const foundSystemRole = await SystemRoleSchema.findOne({
      where: { systemRoleName: systemRole.systemRoleName.value },
    });
    try {
      if (!foundSystemRole) {
        const rawSystemRole: any = SystemRoleMapper.toPersistence(systemRole);

        const systemRoleCreated = await SystemRoleSchema.create(rawSystemRole);
        await systemRoleCreated.save();

        return SystemRoleMapper.toDomain(systemRoleCreated);
      } else {
        foundSystemRole.systemRoleName = systemRole.systemRoleName.value;

        await foundSystemRole.save();
        return systemRole;
      }
    } catch (err) {
      throw err;
    }
  }
  async findById(id: string): Promise<SystemRole | null> {
    const wantedSystemRole = await SystemRoleSchema.findByPk(id);

    if (wantedSystemRole != null) {
      return SystemRoleMapper.toDomain(wantedSystemRole);
    }
    return null;
  }
}
