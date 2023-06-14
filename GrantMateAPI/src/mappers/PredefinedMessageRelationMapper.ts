import { UniqueEntityID } from "../core/domain/UniqueEntityID";
import { DTO } from "../core/infra/DTO";
import { Result } from "../core/logic/Result";
import { PredefinedMessage } from "../domain/message/predefined-message-content/predefinedMessage";
import { PredefinedMessageRelation } from "../domain/message/predefined-message-relations/predefinedMessageRelation";
import { IPredefinedMessageRelationDTO } from "../dto/messages/IPredefinedMessageRelationDTO";

export class PredefinedMessageRelationMapper {
  public static async toDomain(raw: any): Promise<PredefinedMessageRelation> {
    const predefinedMessageRelation = PredefinedMessageRelation.create(
      {
        predefinedMessageA: raw.predefinedMessageA,
        predefinedMessageB: raw.predefinedMessageB,
        predefinedMessageBOnCancel: raw.predefinedMessageBOnCancel,
      },
      new UniqueEntityID(raw.domainId)
    );

    if (predefinedMessageRelation.isFailure) {
      throw new Error(predefinedMessageRelation.error.toString());
    }

    return predefinedMessageRelation.getValue();
  }

  public static toDTO(
    predefinedMessageRelation: PredefinedMessageRelation
  ): IPredefinedMessageRelationDTO {
    const predefinedMessageTypeA =
      predefinedMessageRelation.predefinedMessageA instanceof PredefinedMessage
        ? "SIMPLE"
        : "DROPDOWN_SELECTION_VALUE";
    const predefinedMessageNameIdA =
      predefinedMessageRelation.predefinedMessageA instanceof PredefinedMessage
        ? predefinedMessageRelation.predefinedMessageA.predefinedMessageNameId
            .value
        : predefinedMessageRelation.predefinedMessageA.dropdownValueNameId
            .value;

    const predefinedMessageTypeB = "SIMPLE";
    const predefinedMessageNameIdB =
      predefinedMessageRelation.predefinedMessageB.predefinedMessageNameId
        .value;

    const predefinedMessageOnCancel =
      predefinedMessageRelation.predefinedMessageBOnCancel;

    return {
      currentPredefinedMessageType: predefinedMessageTypeA,
      nextPredefinedMessageType: predefinedMessageTypeB,
      currentPredefinedMessageNameId: predefinedMessageNameIdA,
      nextPredefinedMessageNameId: predefinedMessageNameIdB,
      nextPredefinedMessageTypeOnCancel: predefinedMessageOnCancel
        ? "SIMPLE"
        : null,
      nextPredefinedMessageNameIdOnCancel: predefinedMessageOnCancel
        ? predefinedMessageOnCancel.predefinedMessageNameId.value
        : null,
    } as IPredefinedMessageRelationDTO;
  }
  public static toPersistence(
    predefinedMessageRelation: PredefinedMessageRelation
  ): any {
    const predefinedMessageA =
      predefinedMessageRelation.predefinedMessageA instanceof PredefinedMessage
        ? predefinedMessageRelation.predefinedMessageA
        : null;
    const dropdownValueA =
      predefinedMessageRelation.predefinedMessageA instanceof PredefinedMessage
        ? null
        : predefinedMessageRelation.predefinedMessageA;
    const predefinedMessageRelationPersistence = {
      domainId: predefinedMessageRelation.id.toString(),
      predefinedMessageAId: predefinedMessageA,
      predefinedDropdownValueAId: dropdownValueA,
      predefinedMessageBId: predefinedMessageRelation.predefinedMessageB,
      predefinedMessageBOnCancelId:
        predefinedMessageRelation.predefinedMessageBOnCancel,
    };
    return predefinedMessageRelationPersistence;
  }
}
