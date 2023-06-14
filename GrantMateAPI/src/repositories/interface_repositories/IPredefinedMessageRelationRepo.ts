import { Repo } from "../../core/infra/Repo";
import { PredefinedMessage } from "../../domain/message/predefined-message-content/predefinedMessage";
import { PredefinedMessageRelation } from "../../domain/message/predefined-message-relations/predefinedMessageRelation";
import { PredefinedMessageRelationId } from "../../domain/message/predefined-message-relations/predefinedMessageRelationId";
import { IPredefinedMessageRelationDTO } from "../../dto/messages/IPredefinedMessageRelationDTO";

export default interface IPredefinedMessageRelationRepo
  extends Repo<PredefinedMessageRelation> {
  exists(
    predefinedMessageRelationDTO: IPredefinedMessageRelationDTO
  ): Promise<boolean>;
  save(
    predefinedMessageRelation: PredefinedMessageRelation
  ): Promise<PredefinedMessageRelation>;
  delete(
    predefinedMessageRelationId: PredefinedMessageRelationId | number
  ): Promise<PredefinedMessageRelation>;
  hasValues(): Promise<boolean>;
  findByMessageAId(
    predefinedMessageAId: number
  ): Promise<PredefinedMessageRelation | null>;
  findByDropdownValue(
    dropdownDBId: number
  ): Promise<PredefinedMessageRelation | null>;
  deleteAll(): Promise<void>;
}
