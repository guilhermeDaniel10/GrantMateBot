import { Inject, Service } from "typedi";
import IServiceCallService from "../../interface_services/message_services/IServiceCallService";
import { Result } from "../../../core/logic/Result";
import { IServiceCallDTO } from "../../../dto/messages/IServiceCallDTO";
import { FileUtils } from "../../../utils/FileUtils";
import config from "../../../config";
import IServiceCallRepo from "../../../repositories/interface_repositories/IServiceCallRepo";
import { ServiceCall } from "../../../domain/message/service-call/serviceCall";
import { ServiceCallNameId } from "../../../domain/message/service-call/serviceCallNameId";
import { ServiceCallEndpoint } from "../../../domain/message/service-call/serviceCallEndpoint";
import { ServiceCallPayload } from "../../../domain/message/service-call/serviceCallPayload";
import { StatusCodes } from "http-status-codes";
import DataReader from "./DataReader";

@Service()
export default class ServiceCallService
  extends DataReader<IServiceCallDTO>
  implements IServiceCallService
{
  constructor(
    @Inject(config.repos.serviceCall.name)
    private serviceCallRepo: IServiceCallRepo
  ) {
    super();
  }

  protected retrieveData(): Promise<Result<IServiceCallDTO[]>> {
    return this.readServiceCallMessages();
  }

  async readServiceCallMessages(): Promise<Result<IServiceCallDTO[]>> {
    try {
      const readDropdownFile = FileUtils.readFileFromPredefinedMessages(
        "service_call_messages.json"
      );

      const serviceCall = readDropdownFile.serviceCall;

      let serviceCallDTOArray: IServiceCallDTO[] = [];

      await Promise.all(
        serviceCall.map(async (serviceCallMessage: IServiceCallDTO) => {
          console.log(serviceCallMessage);
          const serviceCall = await this.createServiceCall(serviceCallMessage);
          console.log(serviceCall);
          const savedServiceCall = await this.serviceCallRepo.save(
            serviceCall.getValue()
          );

          serviceCallDTOArray.push({
            nameId: savedServiceCall.serviceCallNameId.value,
            endpoint: savedServiceCall.serviceCallEndpoint.value,
            payload: savedServiceCall.serviceCallPayload.value,
          });
        })
      );

      return Result.ok<IServiceCallDTO[]>(serviceCallDTOArray);
    } catch (e: any) {
      console.error(e);
      return Result.fail<IServiceCallDTO[]>(e.error, StatusCodes.FORBIDDEN);
    }
  }

  private async createServiceCall(
    serviceCallDTO: IServiceCallDTO
  ): Promise<Result<ServiceCall>> {
    const serviceCallNameId = ServiceCallNameId.create(serviceCallDTO.nameId);
    const serviceCallEndpoint = ServiceCallEndpoint.create(
      serviceCallDTO.endpoint
    );
    const serviceCallPayload = ServiceCallPayload.create(
      serviceCallDTO.payload
    );

    if (
      serviceCallNameId.isFailure ||
      serviceCallEndpoint.isFailure ||
      serviceCallPayload.isFailure
    ) {
      throw Result.fail<IServiceCallDTO>(
        "Cannot create service call",
        StatusCodes.FORBIDDEN
      );
    }

    const exists = await this.serviceCallRepo.exists(
      serviceCallNameId.getValue()
    );
    if (exists) {
      throw Result.fail<IServiceCallDTO>(
        "Service call already exists",
        StatusCodes.FORBIDDEN
      );
    }

    const serviceCallOrError = ServiceCall.create({
      serviceCallNameId: serviceCallNameId.getValue(),
      serviceCallEndpoint: serviceCallEndpoint.getValue(),
      serviceCallPayload: serviceCallPayload.getValue(),
    });

    if (serviceCallOrError.isFailure) {
      throw Result.fail<IServiceCallDTO>(
        "Cannot create service call",
        StatusCodes.FORBIDDEN
      );
    }
    return serviceCallOrError;
  }

  async deleteAllServiceCallMessages(): Promise<Result<boolean>> {
    try {
      await this.serviceCallRepo.deleteAll();
      return Result.ok<boolean>(true);
    } catch (e: any) {
      console.error(e);
      return Result.fail<boolean>(e.error, StatusCodes.FORBIDDEN);
    }
  }
}
