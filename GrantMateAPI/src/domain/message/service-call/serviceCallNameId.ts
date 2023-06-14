import { ValueObject } from "../../../core/domain/ValueObject";
import { Guard } from "../../../core/logic/Guard";
import { Result } from "../../../core/logic/Result";
import { StatusCodes } from "http-status-codes";

interface ServiceCallNameIdProps {
  value: string;
}

export class ServiceCallNameId extends ValueObject<ServiceCallNameIdProps> {
  public static minLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ServiceCallNameIdProps) {
    super(props);
  }

  public static create(
    serviceCallNameId: string
  ): Result<ServiceCallNameId> {
    const serviceCallNameIdResult = Guard.againstNullOrUndefined(
      serviceCallNameId,
      "serviceCallNameId"
    );

    if (!serviceCallNameIdResult.succeeded) {
      return Result.fail<ServiceCallNameId>(
        serviceCallNameIdResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    const minLengthResult = Guard.againstAtLeast(
      this.minLength,
      serviceCallNameId
    );
    if (!minLengthResult.succeeded) {
      return Result.fail<ServiceCallNameId>(
        minLengthResult.message || "",
        StatusCodes.FORBIDDEN
      );
    }

    return Result.ok<ServiceCallNameId>(
      new ServiceCallNameId({ value: serviceCallNameId })
    );
  }
}
