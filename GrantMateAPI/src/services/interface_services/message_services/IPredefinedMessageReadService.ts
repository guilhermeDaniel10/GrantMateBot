import { Result } from "../../../core/logic/Result";
import { IPredefinedMessageDTO } from "../../../dto/messages/IPredefinedMessageDTO";

export default interface IPredefinedMessageReadService {
  readPredefinedMessages(): Promise<Result<IPredefinedMessageDTO[]>>;
  findPredefinedMessageByNameId(
    nameId: string
  ): Promise<Result<IPredefinedMessageDTO>>;
  findPredefinedMessageById(
    predefinedMessageDbId: number
  ): Promise<Result<IPredefinedMessageDTO>>;
  deleteAllPredefinedMessages(): Promise<Result<boolean>>;
  readData(): Promise<IPredefinedMessageDTO[]>;
}
