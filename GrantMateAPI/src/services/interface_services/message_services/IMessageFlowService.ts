import { Result } from "../../../core/logic/Result";
import { IInputMessageDTO } from "../../../dto/messages/IInputMessageDTO";
import { IOutputMessageDTO } from "../../../dto/messages/IOutputMessageDTO";

export default interface IMessageFlowService {
  getNextMessage(
    inputMessage: IInputMessageDTO
  ): Promise<Result<IOutputMessageDTO>>;
  getInitialMessage(): Promise<Result<IOutputMessageDTO>>;
}
