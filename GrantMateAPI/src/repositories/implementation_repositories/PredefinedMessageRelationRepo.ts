import { Inject, Service } from "typedi";
import IPredefinedMessageRelationRepo from "../interface_repositories/IPredefinedMessageRelationRepo";
import { PredefinedMessageRelation } from "../../domain/message/predefined-message-relations/predefinedMessageRelation";
import { PredefinedMessageRelationId } from "../../domain/message/predefined-message-relations/predefinedMessageRelationId";
import { IPredefinedMessageRelationDTO } from "../../dto/messages/IPredefinedMessageRelationDTO";
import config from "../../config";
import IPredefinedMessageRepo from "../interface_repositories/IPredefinedMessageRepo";
import { PredefinedMessageRelationSchema } from "../../sequelize_schemas/PredefinedMessagesRelationSchema";
import { PredefinedMessage } from "../../domain/message/predefined-message-content/predefinedMessage";
import { DropdownValue } from "../../domain/message/dropdown/dropdown-value/dropdownValue";
import IDropdownValueRepo from "../interface_repositories/IDropdownValueRepo";
import { PredefinedMessageSchema } from "../../sequelize_schemas/PredefinedMessageSchema";
import { DropdownValueSchema } from "../../sequelize_schemas/DropdownValueSchema";
import { PredefinedMessageRelationMapper } from "../../mappers/PredefinedMessageRelationMapper";

@Service()
export default class PredefinedMessageRelationRepo
  implements IPredefinedMessageRelationRepo
{
  constructor(
    @Inject(config.repos.predefinedMessage.name)
    private predefinedMessageRepo: IPredefinedMessageRepo,
    @Inject(config.repos.dropdownValue.name)
    private dropdownValueRepo: IDropdownValueRepo
  ) {}

  async exists(
    predefinedMessageRelationDTO: IPredefinedMessageRelationDTO
  ): Promise<boolean> {
    const predefinedMessageANameId =
      predefinedMessageRelationDTO.currentPredefinedMessageNameId;
    //Message B is always of simple type

    const predefinedMessage = await PredefinedMessageSchema.findOne({
      where: {
        nameId: predefinedMessageANameId,
      },
    });

    if (!predefinedMessage) {
      throw new Error("Predefined message not found");
    }

    const predefiendMessageRelation =
      await PredefinedMessageRelationSchema.findOne({
        where: {
          predefinedMessageAId: predefinedMessage.id,
        },
      });

    return !!predefiendMessageRelation === true;
  }
  async save(
    predefinedMessageRelation: PredefinedMessageRelation
  ): Promise<PredefinedMessageRelation> {
    const predefinedMessageAType =
      predefinedMessageRelation.predefinedMessageA instanceof PredefinedMessage
        ? "SIMPLE"
        : "DROPDOWN";

    const predefinedMessageBDomain =
      predefinedMessageRelation.predefinedMessageB;

    const wantedPredefinedMessageB = await PredefinedMessageSchema.findOne({
      where: {
        nameId: predefinedMessageBDomain.predefinedMessageNameId.value,
      },
    });
    if (!wantedPredefinedMessageB) {
      throw new Error("Predefined message B not found");
    }

    let wantedPredefinedMessageBOnCancel: PredefinedMessageSchema | null = null;
    if (predefinedMessageRelation.predefinedMessageBOnCancel) {
      const predefinedMessageBOnCancelDomain =
        predefinedMessageRelation.predefinedMessageBOnCancel;

      wantedPredefinedMessageBOnCancel = await PredefinedMessageSchema.findOne({
        where: {
          nameId:
            predefinedMessageBOnCancelDomain.predefinedMessageNameId.value,
        },
      });

      if (!wantedPredefinedMessageBOnCancel) {
        throw new Error("Predefined message B on cancel not found");
      }
    }

    if (predefinedMessageAType === "SIMPLE") {
      const predefinedMessageADomain =
        predefinedMessageRelation.predefinedMessageA as PredefinedMessage;

      const wantedPredefinedMessageA = await PredefinedMessageSchema.findOne({
        where: {
          nameId: predefinedMessageADomain.predefinedMessageNameId.value,
        },
      });
      if (!wantedPredefinedMessageA) {
        throw new Error("Predefined message A not found");
      }

      const predefinedMessageRelationCreated =
        await PredefinedMessageRelationSchema.create({
          predefinedMessageAId: wantedPredefinedMessageA.id,
          predefinedMessageBId: wantedPredefinedMessageB.id,
          predefinedMessageBIdOnCancel: wantedPredefinedMessageBOnCancel
            ? wantedPredefinedMessageBOnCancel.id
            : null,
        });

      await predefinedMessageRelationCreated.save();

      return predefinedMessageRelation;
    } else {
      const predefinedMessageADomain =
        predefinedMessageRelation.predefinedMessageA as DropdownValue;

      const wantedPredefinedDropdownA = await DropdownValueSchema.findOne({
        where: {
          nameId: predefinedMessageADomain.dropdownValueNameId.value,
        },
      });

      if (!wantedPredefinedDropdownA) {
        throw new Error("Dropdown Value A not found");
      }

      const predefinedMessageRelationCreated =
        await PredefinedMessageRelationSchema.create({
          predefinedDropdownValueAId: wantedPredefinedDropdownA.id,
          predefinedMessageBId: wantedPredefinedMessageB.id,
          predefinedMessageBIdOnCancel: wantedPredefinedMessageBOnCancel
            ? wantedPredefinedMessageBOnCancel.id
            : undefined,
        });

      await predefinedMessageRelationCreated.save();

      return predefinedMessageRelation;
    }
  }
  delete(
    predefinedMessageRelationId: number | PredefinedMessageRelationId
  ): Promise<PredefinedMessageRelation> {
    throw new Error("Method not implemented.");
  }

  async hasValues(): Promise<boolean> {
    const allRelations = await PredefinedMessageRelationSchema.findAll();

    if (!allRelations || allRelations.length === 0) {
      return false;
    }

    return true;
  }

  async findByMessageAId(
    predefinedMessageAId: number
  ): Promise<PredefinedMessageRelation | null> {
    const predefinedMessageRelation =
      await PredefinedMessageRelationSchema.findOne({
        where: {
          predefinedMessageAId: predefinedMessageAId,
        },
      });

    if (!predefinedMessageRelation) {
      throw new Error("Predefined message relation not found");
    }

    const predefinedMessageA = await this.predefinedMessageRepo.findById(
      predefinedMessageAId
    );
    const predefinedMessageB = await this.predefinedMessageRepo.findById(
      predefinedMessageRelation.predefinedMessageBId
    );

    let predefinedMessageBOnCancel = undefined;
    if (predefinedMessageRelation.predefinedMessageBIdOnCancel) {
      predefinedMessageBOnCancel = await this.predefinedMessageRepo.findById(
        predefinedMessageRelation.predefinedMessageBIdOnCancel
      );
    }

    const rawRelation = {
      predefinedMessageA: predefinedMessageA,
      predefinedMessageB: predefinedMessageB,
      predefinedMessageBOnCancel: predefinedMessageBOnCancel,
    };

    const predefinedMessageRelationDomain =
      PredefinedMessageRelationMapper.toDomain(rawRelation);

    return predefinedMessageRelationDomain;
  }

  async findByDropdownValue(
    dropdownDBId: number
  ): Promise<PredefinedMessageRelation | null> {
    const predefinedMessageRelation =
      await PredefinedMessageRelationSchema.findOne({
        where: {
          predefinedDropdownValueAId: dropdownDBId,
        },
      });

    if (!predefinedMessageRelation) {
      return null;
    }

    const predefinedMessageA = await this.dropdownValueRepo.findByDropdownDBId(
      dropdownDBId
    );
    const predefinedMessageB = await this.predefinedMessageRepo.findById(
      predefinedMessageRelation.predefinedMessageBId
    );

    let predefinedMessageBOnCancel = undefined;
    if (predefinedMessageRelation.predefinedMessageBIdOnCancel) {
      predefinedMessageBOnCancel = await this.predefinedMessageRepo.findById(
        predefinedMessageRelation.predefinedMessageBIdOnCancel
      );
    }

    const rawRelation = {
      predefinedMessageA: predefinedMessageA,
      predefinedMessageB: predefinedMessageB,
      predefinedMessageBOnCancel: predefinedMessageBOnCancel,
    };

    const predefinedMessageRelationDomain =
      PredefinedMessageRelationMapper.toDomain(rawRelation);

    return predefinedMessageRelationDomain;
  }

  async deleteAll(): Promise<void> {
    await PredefinedMessageRelationSchema.destroy({
      where: {},
    });
  }
}
