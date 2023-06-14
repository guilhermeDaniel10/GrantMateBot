import { Result } from "../../../core/logic/Result";
import { IMessagesBootstrapDTO } from "../../../dto/messages/IMessagesBootstrapDTO";

export default interface IPredefinedMessageBootstrapService {
  bootstrapPredefinedMessages(): Promise<Result<IMessagesBootstrapDTO>>;
  deleteAllPredefinedMessages(): Promise<Result<void>>;
}
