import { AggregateRoot } from "../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../core/domain/UniqueEntityID";
import { Guard } from "../../core/logic/Guard";
import { Result } from "../../core/logic/Result";
import { SystemRoleId } from "./systemRoleId";
import { SystemRoleName } from "./systemRoleName";

interface SystemRoleProps {
  systemRoleName: SystemRoleName;
}

export class SystemRole extends AggregateRoot<SystemRoleProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get systemRoleId(): SystemRoleId {
    return SystemRoleId.caller(this.id);
  }

  get systemRoleName(): SystemRoleName {
    return this.props.systemRoleName;
  }

  private constructor(props: SystemRoleProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: SystemRoleProps,
    id?: UniqueEntityID
  ): Result<SystemRole> {
    const guardedProps = [
      { argument: props.systemRoleName, argumentName: "systemRoleName" },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<SystemRole>(guardResult.message || "");
    } else {
      const systemRole = new SystemRole(
        {
          ...props,
        },
        id
      );

      return Result.ok<SystemRole>(systemRole);
    }
  }
}
