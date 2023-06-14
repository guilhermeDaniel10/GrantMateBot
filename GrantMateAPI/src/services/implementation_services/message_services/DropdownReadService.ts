import { Inject, Service } from "typedi";
import IDropdownReadService from "../../interface_services/message_services/IDropdownReadService";
import { Result } from "../../../core/logic/Result";
import { IDropdownValueDTO } from "../../../dto/messages/IDropdownValueDTO";
import config from "../../../config";
import IDropdownRepo from "../../../repositories/interface_repositories/IDropdownRepo";
import { FileUtils } from "../../../utils/FileUtils";
import { IDropdownCorrespondingValuesDTO } from "../../../dto/messages/IDropdownCorrespondingValuesDTO";
import { StatusCodes } from "http-status-codes";
import IDropdownValueRepo from "../../../repositories/interface_repositories/IDropdownValueRepo";
import { DropdownMapper } from "../../../mappers/DropdownMapper";
import { IDropdownDTO } from "../../../dto/messages/IDropdownDTO";
import { DropdownValueMapper } from "../../../mappers/DropdownValueMapper";
import IDropdownFactory from "../../../factories/interface-factories/IDropdownFactory";
import DataReader from "./DataReader";
import IDropdownValueFactory from "../../../factories/interface-factories/IDropdownValueFactory";

@Service()
export default class DropdownReadService
  extends DataReader<IDropdownCorrespondingValuesDTO>
  implements IDropdownReadService
{
  constructor(
    @Inject(config.repos.dropdown.name)
    private dropdownRepo: IDropdownRepo,
    @Inject(config.repos.dropdownValue.name)
    private dropdownValueRepo: IDropdownValueRepo,
    @Inject(config.factories.dropdown.name)
    private dropdownFactory: IDropdownFactory,
    @Inject(config.factories.dropdownValue.name)
    private dropdownValueFactory: IDropdownValueFactory
  ) {
    super();
  }

  protected async retrieveData(): Promise<
    Result<IDropdownCorrespondingValuesDTO[]>
  > {
    return await this.readDropdownMessages();
  }

  async readDropdownMessages(): Promise<
    Result<IDropdownCorrespondingValuesDTO[]>
  > {
    try {
      const readDropdownFile = FileUtils.readFileFromPredefinedMessages(
        "dropdown_messages.json"
      );

      const dropdownMessages = readDropdownFile.dropdownMessages;

      let dropdownCorrespondingValuesDTOArray: IDropdownCorrespondingValuesDTO[] =
        [];

      await Promise.all(
        dropdownMessages.map(
          async (dropdownMessage: IDropdownCorrespondingValuesDTO) => {
            let currentDropdownValues: IDropdownCorrespondingValuesDTO = {
              nameId: dropdownMessage.nameId,
              asButton: dropdownMessage.asButton,
              values: [],
            };
            const dropdown = await this.dropdownFactory.createDropdown(
              dropdownMessage
            );
            const savedDropdown = await this.dropdownRepo.save(
              dropdown.getValue()
            );

            await Promise.all(
              dropdownMessage.values.map(
                async (dropdownValue: IDropdownValueDTO) => {
                  const dropdownValueOrError =
                    this.dropdownValueFactory.createDropdownValue(
                      dropdownValue,
                      savedDropdown
                    );

                  const savedDropdownValues = await this.dropdownValueRepo.save(
                    dropdownValueOrError.getValue()
                  );
                  currentDropdownValues.values.push({
                    nameId: savedDropdownValues.dropdownValueNameId.value,
                    content: savedDropdownValues.dropdownValueContent.value,
                  });
                }
              )
            );
            dropdownCorrespondingValuesDTOArray.push(currentDropdownValues);
          }
        )
      );

      return Result.ok<IDropdownCorrespondingValuesDTO[]>(
        dropdownCorrespondingValuesDTOArray
      );
    } catch (error) {
      console.log(error);
      return Result.fail<IDropdownCorrespondingValuesDTO[]>(
        "Cannot read dropdown messages",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findDropdownValueById(
    dropdownId: number
  ): Promise<Result<IDropdownValueDTO>> {
    try {
      const dropdownValue = await this.dropdownValueRepo.findByDropdownDBId(
        dropdownId
      );
      console.log(dropdownValue);
      if (!dropdownValue) {
        return Result.fail<IDropdownValueDTO>(
          "Cannot find dropdown value",
          StatusCodes.NOT_FOUND
        );
      }

      const dropdownValueDto = (await DropdownValueMapper.toDTO(
        dropdownValue
      )) as IDropdownValueDTO;

      return Result.ok<IDropdownValueDTO>(dropdownValueDto);
    } catch (error) {
      console.log(error);
      return Result.fail<IDropdownValueDTO>(
        "Cannot find dropdown value",
        StatusCodes.NOT_FOUND
      );
    }
  }

  async findDropdownValueByNameId(
    dropdownNameId: string
  ): Promise<Result<IDropdownValueDTO>> {
    const dropdownValue = await this.dropdownValueRepo.findByNameId(
      dropdownNameId
    );

    if (!dropdownValue) {
      return Result.fail<IDropdownValueDTO>(
        "Cannot find dropdown value",
        StatusCodes.NOT_FOUND
      );
    }

    const dropdownValueDto = (await DropdownValueMapper.toDTO(
      dropdownValue
    )) as IDropdownValueDTO;

    return Result.ok<IDropdownValueDTO>(dropdownValueDto);
  }

  async findDropdownWithValuesByNameId(
    dropdownNameId: string
  ): Promise<Result<IDropdownDTO>> {
    try {
      const dropdown = await this.dropdownRepo.findDropdownWithValuesByNameId(
        dropdownNameId
      );
      if (!dropdown) {
        return Result.fail<IDropdownDTO>(
          "Cannot find dropdown",
          StatusCodes.NOT_FOUND
        );
      }

      const dropdownDto = (await DropdownMapper.toDTOWithValues(
        dropdown
      )) as IDropdownDTO;
      return Result.ok<IDropdownDTO>(dropdownDto);
    } catch (error) {
      console.log(error);
      return Result.fail<IDropdownDTO>(
        "Cannot find dropdown",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteAllDropdowns(): Promise<Result<boolean>> {
    try {
      await this.dropdownRepo.deleteAll();
      return Result.ok<boolean>(true);
    } catch (error) {
      console.log(error);
      return Result.fail<boolean>(
        "Cannot delete all dropdowns",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}
