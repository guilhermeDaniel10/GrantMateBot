import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface ServiceCallPayloadProps {
  value: any;
}

export class ServiceCallPayload extends ValueObject<ServiceCallPayloadProps> {
  get value(): any {
    return this.props.value;
  }

  private constructor(props: ServiceCallPayloadProps) {
    super(props);
  }

  public static create(serviceCallPayload: any): Result<ServiceCallPayload> {
    const serviceCallPayloadResult = Guard.againstNullOrUndefined(
      serviceCallPayload,
      "serviceCallPayload"
    );

    if (!serviceCallPayloadResult.succeeded) {
      return Result.fail<ServiceCallPayload>(
        serviceCallPayloadResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<ServiceCallPayload>(
      new ServiceCallPayload({ value: serviceCallPayload })
    );
  }
}
