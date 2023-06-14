import { Result } from "../../core/logic/Result";
import { PredefinedMessage } from "../../domain/message/predefined-message-content/predefinedMessage";
import { IPredefinedMessageDTO } from "../../dto/messages/IPredefinedMessageDTO";

export default interface IPredefinedMessageFactory {
  createPredefinedMessage(
    predefinedMessageDTO: IPredefinedMessageDTO
  ): Promise<Result<PredefinedMessage>>;
}
