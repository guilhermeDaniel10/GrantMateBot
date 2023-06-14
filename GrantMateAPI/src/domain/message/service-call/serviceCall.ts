import { AggregateRoot } from "../../../core/domain/AggregateRoot";
import { UniqueEntityID } from "../../../core/domain/UniqueEntityID";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { ServiceCallEndpoint } from "./serviceCallEndpoint";
import { ServiceCallId } from "./serviceCallId";
import { ServiceCallNameId } from "./serviceCallNameId";
import { ServiceCallPayload } from "./serviceCallPayload";

interface ServiceCallProps {
  dbServiceCallId?: number;
  serviceCallEndpoint: ServiceCallEndpoint;
  serviceCallNameId: ServiceCallNameId;
  serviceCallPayload: ServiceCallPayload;
}

export class ServiceCall extends AggregateRoot<ServiceCallProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get serviceCallId(): ServiceCallId {
    return ServiceCallId.caller(this.id);
  }

  get dbServiceCallId(): number | undefined {
    return this.props.dbServiceCallId;
  }

  get serviceCallEndpoint(): ServiceCallEndpoint {
    return this.props.serviceCallEndpoint;
  }

  get serviceCallNameId(): ServiceCallNameId {
    return this.props.serviceCallNameId;
  }

  get serviceCallPayload(): ServiceCallPayload {
    return this.props.serviceCallPayload;
  }

  private constructor(props: ServiceCallProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(
    props: ServiceCallProps,
    id?: UniqueEntityID
  ): Result<ServiceCall> {
    const guardedProps = [
      {
        argument: props.serviceCallEndpoint,
        argumentName: "serviceCallEndpoint",
      },
      {
        argument: props.serviceCallNameId,
        argumentName: "serviceCallNameId",
      },
      {
        argument: props.serviceCallPayload,
        argumentName: "serviceCallPayload",
      },
    ];

    const guardResult = Guard.againstNullOrUndefinedBulk(guardedProps);

    if (!guardResult.succeeded) {
      return Result.fail<ServiceCall>(guardResult.message || "");
    } else {
      const serviceCall = new ServiceCall(
        {
          ...props,
        },
        id
      );

      return Result.ok<ServiceCall>(serviceCall);
    }
  }
}
