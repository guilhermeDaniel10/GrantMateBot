import { Repo } from "../../core/infra/Repo";
import { PredefinedMessage } from "../../domain/message/predefined-message-content/predefinedMessage";
import { PredefinedMessageId } from "../../domain/message/predefined-message-content/predefinedMessageId";
import { PredefinedMessageNameId } from "../../domain/message/predefined-message-content/predefinedMessageNameId";

export default interface IPredefinedMessageRepo
  extends Repo<PredefinedMessage> {
  exists(predefinedMessageNameId: PredefinedMessageNameId): Promise<boolean>;
  save(predefinedMessage: PredefinedMessage): Promise<PredefinedMessage>;
  delete(predefinedMessageId: PredefinedMessageId | number): Promise<File>;
  findByNameId(
    predefinedMessageNameId: PredefinedMessageNameId | string
  ): Promise<PredefinedMessage | null>;
  findAll(): Promise<PredefinedMessage[]>;
  findByNameIdFullInformation(nameId: string): Promise<PredefinedMessage>;
  findById(predefinedMessageDbId: number): Promise<PredefinedMessage>;
  deleteAll(): Promise<void>;
}
