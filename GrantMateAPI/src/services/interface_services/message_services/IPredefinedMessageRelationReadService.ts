import { Result } from "../../../core/logic/Result";
import { IPredefinedMessageRelationDTO } from "../../../dto/messages/IPredefinedMessageRelationDTO";

export default interface IPredefinedMessageRelationReadService {
  readPredefinedMessagesRelations(): Promise<
    Result<IPredefinedMessageRelationDTO[]>
  >;
  deleteAllRelations(): Promise<Result<boolean>>;
  readData(): Promise<IPredefinedMessageRelationDTO[]>;
}
