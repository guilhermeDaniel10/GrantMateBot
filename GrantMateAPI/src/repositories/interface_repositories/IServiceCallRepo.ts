import { Repo } from "../../core/infra/Repo";
import { ServiceCall } from "../../domain/message/service-call/serviceCall";
import { ServiceCallId } from "../../domain/message/service-call/serviceCallId";
import { ServiceCallNameId } from "../../domain/message/service-call/serviceCallNameId";

export default interface IServiceCallRepo extends Repo<ServiceCall> {
  exists(serviceCallNameId: ServiceCallNameId): Promise<boolean>;
  save(serviceCall: ServiceCall): Promise<ServiceCall>;
  delete(serviceCallId: ServiceCallId | number): Promise<ServiceCall>;
  findByNameId(
    serviceCallNameId: ServiceCallNameId | string
  ): Promise<ServiceCall | null>;
  deleteAll(): Promise<void>;
}
