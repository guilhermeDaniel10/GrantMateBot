import { Service } from "typedi";
import IServiceCallRepo from "../interface_repositories/IServiceCallRepo";
import { ServiceCall } from "../../domain/message/service-call/serviceCall";
import { ServiceCallId } from "../../domain/message/service-call/serviceCallId";
import { ServiceCallNameId } from "../../domain/message/service-call/serviceCallNameId";
import { ServiceCallSchema } from "../../sequelize_schemas/ServiceCallSchema";
import { ServiceCallMapper } from "../../mappers/ServiceCallMapper";

@Service()
export default class ServiceCallRepo implements IServiceCallRepo {
  async exists(serviceCallNameId: ServiceCallNameId): Promise<boolean> {
    const wantedServiceCallNameId =
      serviceCallNameId instanceof ServiceCallNameId
        ? (<ServiceCallNameId>serviceCallNameId).value
        : serviceCallNameId;
    const wantedServiceCall = await ServiceCallSchema.findOne({
      where: { nameId: wantedServiceCallNameId },
    });

    return !!wantedServiceCall === true;
  }
  async save(serviceCall: ServiceCall): Promise<ServiceCall> {
    const foundServicerCall = await ServiceCallSchema.findOne({
      where: { nameId: serviceCall.serviceCallNameId.value },
    });
    try {
      if (!foundServicerCall) {
        const rawServiceCall: any =
          ServiceCallMapper.toPersistence(serviceCall);

        const serviceCallCreated = await ServiceCallSchema.create(
          rawServiceCall
        );
        // await serviceCallCreated.save();

        return ServiceCallMapper.toDomain(serviceCallCreated);
      } else {
        foundServicerCall.nameId = serviceCall.serviceCallNameId.value;
        foundServicerCall.endpoint = serviceCall.serviceCallEndpoint.value;
        foundServicerCall.payload = serviceCall.serviceCallPayload.value;

        await foundServicerCall.save();
        return serviceCall;
      }
    } catch (err) {
      throw err;
    }
  }
  delete(serviceCallId: number | ServiceCallId): Promise<ServiceCall> {
    throw new Error("Method not implemented.");
  }
  async findByNameId(
    serviceCallNameId: string | ServiceCallNameId
  ): Promise<ServiceCall | null> {
    const wantedServiceCallNameId =
      serviceCallNameId instanceof ServiceCallNameId
        ? (<ServiceCallNameId>serviceCallNameId).value
        : serviceCallNameId;

    return ServiceCallSchema.findOne({
      where: { nameId: wantedServiceCallNameId },
    }).then((foundDropdown) => {
      if (!foundDropdown) return null;
      return ServiceCallMapper.toDomain(foundDropdown);
    });
  }

  async deleteAll(): Promise<void> {
    await ServiceCallSchema.destroy({ where: {} });
  }
}
