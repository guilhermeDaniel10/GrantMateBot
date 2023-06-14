import { Result } from "../../../core/logic/Result";
import { IServiceCallDTO } from "../../../dto/messages/IServiceCallDTO";

export default interface IServiceCallService {
  readServiceCallMessages(): Promise<Result<IServiceCallDTO[]>>;
  deleteAllServiceCallMessages(): Promise<Result<boolean>>;
  readData(): Promise<IServiceCallDTO[]>;
}
