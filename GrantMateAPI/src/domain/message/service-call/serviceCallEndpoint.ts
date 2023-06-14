import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface ServiceCallEndpointProps {
  value: string;
}

export class ServiceCallEndpoint extends ValueObject<ServiceCallEndpointProps> {
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ServiceCallEndpointProps) {
    super(props);
  }

  public static create(
    serviceCallEndpoint: string
  ): Result<ServiceCallEndpoint> {
    const serviceCallEndpointResult = Guard.againstNullOrUndefined(
      serviceCallEndpoint,
      "serviceCallEndpoint"
    );

    if (!serviceCallEndpointResult.succeeded) {
      return Result.fail<ServiceCallEndpoint>(
        serviceCallEndpointResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      serviceCallEndpoint
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<ServiceCallEndpoint>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<ServiceCallEndpoint>(
      new ServiceCallEndpoint({ value: serviceCallEndpoint })
    );
  }
}
