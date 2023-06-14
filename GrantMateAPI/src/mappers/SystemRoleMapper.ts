import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DTO } from "../core/infra/DTO";
import { Result } from "../core/logic/Result";
import { SystemRole } from "../domain/system-role/systemRole";
import { SystemRoleName } from "../domain/system-role/systemRoleName";
import { ISystemRoleDTO } from "../dto/ISystemRoleDTO";

export class SystemRoleMapper {
  public static async toDomain(raw: any): Promise<SystemRole> {
    const systemRoleName = SystemRoleName.create(raw.systemRoleName);

    const dtoResult = Result.combine([systemRoleName]);

    dtoResult.isFailure ? console.log(dtoResult.error) : "";

    const systemRoleOrError = SystemRole.create(
      { systemRoleName: systemRoleName.getValue() },
      new UniqueEntityID(raw.domainId)
    );

    if (systemRoleOrError.isFailure) {
      throw new Error(systemRoleOrError.error.toString());
    }

    return systemRoleOrError.getValue();
  }
  public static toDTO(systemRole: SystemRole): DTO {
    return {
      systemRoleName: systemRole.systemRoleName.value,
    } as ISystemRoleDTO;
  }
  public static toPersistence(systemRole: SystemRole): any {
    const systemRolePersistence = {
      domainId: systemRole.id.toString(),
      systemRoleName: systemRole.systemRoleName.value,
    };
    return systemRolePersistence;
  }
}
