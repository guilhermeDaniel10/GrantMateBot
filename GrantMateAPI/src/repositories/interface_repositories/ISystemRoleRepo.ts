import { Repo } from "../../core/infra/Repo";
import { SystemRole } from "../../domain/system-role/systemRole";
import { SystemRoleName } from "../../domain/system-role/systemRoleName";

export default interface ISystemRoleRepo extends Repo<SystemRole> {
  save(systemRole: SystemRole): Promise<SystemRole>;
  findById(id: string): Promise<SystemRole | null>;
  findBySystemRoleName(
    systemRoleName: string | SystemRoleName
  ): Promise<SystemRole | null>;
}
