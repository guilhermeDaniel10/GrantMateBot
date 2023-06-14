import { Inject, Service } from "typedi";
import IPredefinedMessageRelationReadService from "../../interface_services/message_services/IPredefinedMessageRelationReadService";
import { Result } from "../../../core/logic/Result";
import { IPredefinedMessageRelationDTO } from "../../../dto/messages/IPredefinedMessageRelationDTO";
import { FileUtils } from "../../../utils/FileUtils";
import { PredefinedMessageRelation } from "../../../domain/message/predefined-message-relations/predefinedMessageRelation";
import config from "../../../config";
import IPredefinedMessageRepo from "../../../repositories/interface_repositories/IPredefinedMessageRepo";
import IPredefinedMessageRelationRepo from "../../../repositories/interface_repositories/IPredefinedMessageRelationRepo";
import IDropdownValueRepo from "../../../repositories/interface_repositories/IDropdownValueRepo";
import { PredefinedMessageRelationMapper } from "../../../mappers/PredefinedMessageRelationMapper";
import { PredefinedMessage } from "../../../domain/message/predefined-message-content/predefinedMessage";
import { DropdownValue } from "../../../domain/message/dropdown/dropdown-value/dropdownValue";
import { StatusCodes } from "http-status-codes";
import DataReader from "./DataReader";

@Service()
export default class PredefinedMessageRelationReadService
  extends DataReader<IPredefinedMessageRelationDTO>
  implements IPredefinedMessageRelationReadService
{
  constructor(
    @Inject(config.repos.predefinedMessage.name)
    private predefinedMessageRepo: IPredefinedMessageRepo,
    @Inject(config.repos.predefinedMessageRelation.name)
    private predefinedMessageRelationRepo: IPredefinedMessageRelationRepo,
    @Inject(config.repos.dropdownValue.name)
    private dropdownValueRepo: IDropdownValueRepo
  ) {
    super();
  }

  protected retrieveData(): Promise<Result<IPredefinedMessageRelationDTO[]>> {
    return this.readPredefinedMessagesRelations();
  }

  async readPredefinedMessagesRelations(): Promise<
    Result<IPredefinedMessageRelationDTO[]>
  > {
    try {
      const hasValues = await this.predefinedMessageRelationRepo.hasValues();
      if (hasValues) {
        throw new Error("Predefined message relations already exist");
      }

      const data = FileUtils.readFileFromPredefinedMessages(
        "message_relations.json"
      );
      const predefinedMessagesRelations = data.messageRelations;

      let predefinedMessagerRelationDTOArray: IPredefinedMessageRelationDTO[] =
        [];

      await Promise.all(
        predefinedMessagesRelations.map(
          async (predefinedMessageRelation: IPredefinedMessageRelationDTO) => {
            const predefinedMessageRelationDomain =
              await this.createPredefinedMessageRelation(
                predefinedMessageRelation
              );
            const savedMessageRelation =
              await this.predefinedMessageRelationRepo.save(
                predefinedMessageRelationDomain
              );

            const savedMessageRelationDTO =
              PredefinedMessageRelationMapper.toDTO(savedMessageRelation);

            predefinedMessagerRelationDTOArray.push(savedMessageRelationDTO);
          }
        )
      );
      return Result.ok<IPredefinedMessageRelationDTO[]>(
        predefinedMessagerRelationDTOArray
      );
    } catch (error: any) {
      console.log(error);
      return Result.fail<IPredefinedMessageRelationDTO[]>(
        error,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async createPredefinedMessageRelation(
    predefinedMessageRelationDTO: IPredefinedMessageRelationDTO
  ): Promise<PredefinedMessageRelation> {
    const predefinedMessageTypeA =
      predefinedMessageRelationDTO.currentPredefinedMessageType;
    const predefinedMessageNameIdA =
      predefinedMessageRelationDTO.currentPredefinedMessageNameId;
    const predefinedMessageNameIdB =
      predefinedMessageRelationDTO.nextPredefinedMessageNameId;

    const predefinedMessageNameIdOnCancel =
      predefinedMessageRelationDTO.nextPredefinedMessageNameIdOnCancel;

    const predefinedMessageB: PredefinedMessage =
      (await this.predefinedMessageRepo.findByNameId(
        predefinedMessageNameIdB
      )) as PredefinedMessage;

    if (!predefinedMessageB) {
      throw new Error("Predefined message B not found");
    }

    let predefinedMessageOnCancel = undefined;

    if (predefinedMessageNameIdOnCancel) {
      predefinedMessageOnCancel =
        (await this.predefinedMessageRepo.findByNameId(
          predefinedMessageNameIdOnCancel
        )) as PredefinedMessage;

      if (!predefinedMessageOnCancel) {
        throw new Error("Predefined message on cancel not found");
      }
    }
    if (predefinedMessageTypeA === "SIMPLE") {
      const predefinedMessageA = (await this.predefinedMessageRepo.findByNameId(
        predefinedMessageNameIdA
      )) as PredefinedMessage;

      if (!predefinedMessageA) {
        throw new Error("Predefined message A not found");
      }

      const predefinedMessageRelation =
        PredefinedMessageRelationMapper.toDomain({
          predefinedMessageA: predefinedMessageA,
          predefinedMessageB: predefinedMessageB,
          predefinedMessageBOnCancel: predefinedMessageOnCancel,
        });

      return predefinedMessageRelation;
    } else if (predefinedMessageTypeA === "DROPDOWN_SELECTION_VALUE") {
      const dropdownValueA = (await this.dropdownValueRepo.findByNameId(
        predefinedMessageNameIdA
      )) as DropdownValue;

      if (!dropdownValueA) {
        throw new Error("Dropdown A not found");
      }

      const predefinedMessageRelation =
        PredefinedMessageRelationMapper.toDomain({
          predefinedMessageA: dropdownValueA,
          predefinedMessageB: predefinedMessageB,
          predefinedMessageBOnCancel: predefinedMessageOnCancel,
        });
      return predefinedMessageRelation;
    }

    throw new Error("Predefined message type not found");
  }

  async deleteAllRelations(): Promise<Result<boolean>> {
    try {
      await this.predefinedMessageRelationRepo.deleteAll();
      return Result.ok<boolean>(true);
    } catch (error: any) {
      console.log(error);
      return Result.fail<boolean>(error, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}
