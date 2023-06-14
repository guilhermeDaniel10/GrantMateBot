import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DTO } from "../core/infra/DTO";
import { Result } from "../core/logic/Result";
import { ServiceCall } from "../domain/message/service-call/serviceCall";
import { ServiceCallEndpoint } from "../domain/message/service-call/serviceCallEndpoint";
import { ServiceCallNameId } from "../domain/message/service-call/serviceCallNameId";
import { ServiceCallPayload } from "../domain/message/service-call/serviceCallPayload";
import { IServiceCallDTO } from "../dto/messages/IServiceCallDTO";

export class ServiceCallMapper {
  public static async toDomain(raw: any): Promise<ServiceCall> {
    const serviceCallNameId = ServiceCallNameId.create(raw.nameId);
    const serviceCallEndpoint = ServiceCallEndpoint.create(
      raw.endpoint
    );
    const serviceCallPayload = ServiceCallPayload.create(
      raw.payload
    );

    const dtoResult = Result.combine([
      serviceCallNameId,
      serviceCallEndpoint,
      serviceCallPayload,
    ]);

    dtoResult.isFailure ? console.log(dtoResult.error) : "";

    const serviceCallOrError = ServiceCall.create(
      {
        dbServiceCallId: raw.id,
        serviceCallEndpoint: serviceCallEndpoint.getValue(),
        serviceCallNameId: serviceCallNameId.getValue(),
        serviceCallPayload: serviceCallPayload.getValue(),
      },
      new UniqueEntityID(raw.domainId)
    );

    if (serviceCallOrError.isFailure) {
      throw new Error(serviceCallOrError.error.toString());
    }

    return serviceCallOrError.getValue();
  }
  public static toDTO(serviceCall: ServiceCall): DTO {
    return {
      nameId: serviceCall.serviceCallNameId.value,
      endpoint: serviceCall.serviceCallEndpoint.value,
      payload: serviceCall.serviceCallPayload.value,
    } as IServiceCallDTO;
  }
  public static toPersistence(serviceCall: ServiceCall): any {
    const serviceCallPersistence = {
      domainId: serviceCall.id.toString(),
      nameId: serviceCall.serviceCallNameId.value,
      endpoint: serviceCall.serviceCallEndpoint.value,
      payload: serviceCall.serviceCallPayload.value,
    };
    return serviceCallPersistence;
  }
}
