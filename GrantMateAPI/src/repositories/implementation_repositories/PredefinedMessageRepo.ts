import { Service } from "typedi";
import IPredefinedMessageRepo from "../interface_repositories/IPredefinedMessageRepo";
import { PredefinedMessage } from "../../domain/message/predefined-message-content/predefinedMessage";
import { PredefinedMessageId } from "../../domain/message/predefined-message-content/predefinedMessageId";
import { PredefinedMessageNameId } from "../../domain/message/predefined-message-content/predefinedMessageNameId";
import { PredefinedMessageSchema } from "../../sequelize_schemas/PredefinedMessageSchema";
import { PredefinedMessageMapper } from "../../mappers/PredefinedMessageMapper";
import { ServiceCallSchema } from "../../sequelize_schemas/ServiceCallSchema";
import { DropdownSchema } from "../../sequelize_schemas/DropdownSchema";
import { DropdownValueSchema } from "../../sequelize_schemas/DropdownValueSchema";
import { DropdownMapper } from "../../mappers/DropdownMapper";
import { ServiceCallMapper } from "../../mappers/ServiceCallMapper";

@Service()
export default class PredefinedMessageRepo implements IPredefinedMessageRepo {
  async exists(
    predefinedMessageNameId: PredefinedMessageNameId
  ): Promise<boolean> {
    const wantedPredefinedMessageNameId =
      predefinedMessageNameId instanceof PredefinedMessageNameId
        ? (<PredefinedMessageNameId>predefinedMessageNameId).value
        : predefinedMessageNameId;
    const wantedPredefinedMessage = await PredefinedMessageSchema.findOne({
      where: { nameId: wantedPredefinedMessageNameId },
    });

    return !!wantedPredefinedMessage === true;
  }

  async save(predefinedMessage: PredefinedMessage): Promise<PredefinedMessage> {
    const foundPredefinedMessage = await PredefinedMessageSchema.findOne({
      where: { nameId: predefinedMessage.predefinedMessageNameId.value },
    });
    try {
      if (!foundPredefinedMessage) {
        const rawPredefinedMessage: any =
          PredefinedMessageMapper.toPersistence(predefinedMessage);

        const predefinedMessageCreated = await PredefinedMessageSchema.create(
          rawPredefinedMessage
        );
        await predefinedMessageCreated.save();

        return PredefinedMessageMapper.toDomain(predefinedMessageCreated);
      } else {
        foundPredefinedMessage.nameId =
          predefinedMessage.predefinedMessageNameId.value;
        foundPredefinedMessage.content =
          predefinedMessage.predefinedMessageContent.value;
        foundPredefinedMessage.fromBot =
          predefinedMessage.predefinedMessageFromBot.value;

        await foundPredefinedMessage.save();
        return predefinedMessage;
      }
    } catch (err) {
      throw err;
    }
  }
  async delete(
    predefinedMessageId: number | PredefinedMessageId
  ): Promise<File> {
    throw new Error("Method not implemented.");
  }
  async findByNameId(
    predefinedMessageNameId: string | PredefinedMessageNameId
  ): Promise<PredefinedMessage | null> {
    const nameId =
      predefinedMessageNameId instanceof PredefinedMessageNameId
        ? (<PredefinedMessageNameId>predefinedMessageNameId).value
        : predefinedMessageNameId;

    const foundPredefinedMessage = await PredefinedMessageSchema.findOne({
      where: { nameId: nameId },
    });

    if (!foundPredefinedMessage) {
      return null;
    }

    return PredefinedMessageMapper.toDomain(foundPredefinedMessage);
  }

  async findById(predefinedMessageDbId: number): Promise<PredefinedMessage> {
    const foundPredefinedMessage = await PredefinedMessageSchema.findOne({
      where: { id: predefinedMessageDbId },
      include: [
        { model: ServiceCallSchema, as: "serviceCall" },
        {
          model: DropdownSchema,
          as: "dropdown",
          include: [{ model: DropdownValueSchema, as: "dropdownValues" }],
        },
      ],
    });

    if (!foundPredefinedMessage) {
      throw new Error("Predefined message not found");
    }

    return await this.getFullInformationFromPredefinedMessage(
      foundPredefinedMessage
    );
  }

  async findByNameIdFullInformation(
    nameId: string
  ): Promise<PredefinedMessage> {
    const foundPredefinedMessage = await PredefinedMessageSchema.findOne({
      where: { nameId: nameId },
      include: [
        { model: ServiceCallSchema, as: "serviceCall" },
        {
          model: DropdownSchema,
          as: "dropdown",
          include: [{ model: DropdownValueSchema, as: "dropdownValues" }],
        },
      ],
    });

    if (!foundPredefinedMessage) {
      throw new Error("Predefined message not found");
    }

    return await this.getFullInformationFromPredefinedMessage(
      foundPredefinedMessage
    );
  }

  async findAll(): Promise<PredefinedMessage[]> {
    const foundPredefinedMessages = await PredefinedMessageSchema.findAll({
      include: [
        { model: ServiceCallSchema, as: "serviceCall" },
        {
          model: DropdownSchema,
          as: "dropdown",
          include: [{ model: DropdownValueSchema, as: "dropdownValues" }],
        },
      ],
    });

    if (!foundPredefinedMessages) {
      return [];
    }

    let mappedMessages: PredefinedMessage[] = [];

    await Promise.all(
      foundPredefinedMessages.map(async (predefinedMessage) => {
        let currentPredefinedMessage =
          await this.getFullInformationFromPredefinedMessage(predefinedMessage);
        mappedMessages.push(currentPredefinedMessage);
      })
    );
    return mappedMessages;
  }

  private async getFullInformationFromPredefinedMessage(
    predefinedMessage: PredefinedMessageSchema
  ): Promise<PredefinedMessage> {
    const messageAsJson = predefinedMessage.toJSON();
    let currentPredefinedMessage = await PredefinedMessageMapper.toDomain(
      predefinedMessage
    );

    if (messageAsJson.dropdown) {
      const dropdownDomain = await DropdownMapper.toDomainWithValues(
        messageAsJson.dropdown
      );
      currentPredefinedMessage.dropdown = dropdownDomain;
    }

    if (messageAsJson.serviceCall) {
      const serviceCallDomain = await ServiceCallMapper.toDomain(
        messageAsJson.serviceCall
      );
      currentPredefinedMessage.serviceCall = serviceCallDomain;
    }
    return currentPredefinedMessage;
  }

  async deleteAll(): Promise<void> {
    await PredefinedMessageSchema.destroy({ where: {} });
  }
}
