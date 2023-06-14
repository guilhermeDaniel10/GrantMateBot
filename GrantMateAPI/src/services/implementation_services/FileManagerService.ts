import Container, { Inject, Service } from "typedi";
import IFileManagerService from "../interface_services/IFileManagerService";
import * as fs from "fs";
import { IFileDTO } from "../../dto/IFileDTO";
import { FileUtils } from "../../utils/FileUtils";
import { IFileObjectDTO } from "../../dto/IFileObjectDTO";
import { FileName } from "../../domain/file/fileName";
import { FileDescription } from "../../domain/file/fileDescription";
import { FileSize } from "../../domain/file/fileSize";
import { FileExtension } from "../../domain/file/fileExtension";
import { FileAccessLevels } from "../../domain/file/fileAccessLevel";
import { FileGPTTrained } from "../../domain/file/fileGPTTrained";
import { File } from "../../domain/file/file";
import { Result } from "../../core/logic/Result";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import IFileRepo from "../../repositories/interface_repositories/IFileRepo";
import { FileMapper } from "../../mappers/FileMapper";
import { ITitleFormatDTO } from "../../dto/ITitleFormatDTO";
import { TitleFormat } from "../../domain/file/document-structure/title/titleFormat";
import { Bold } from "../../domain/file/document-structure/title/bold";
import { Caps } from "../../domain/file/document-structure/title/caps";
import { Color } from "../../domain/file/document-structure/title/color";
import IRestCommunicator from "../../communicators/interface-communicators/IRestCommunicator";
import { IResponseDTO } from "../../dto/IResponseDTO";
import { IStructureOutputDTO } from "../../dto/IStructureOutputDTO";
import {
  FILE_EXTRACTION_TO_TEXT,
  FILE_EXTRACTION_WITH_STRUCTURE,
  GET_STRUCTURED_TEXT,
} from "../../api/endpoints/aibot-endpoint";
import { IStructureLineDTO } from "../../dto/IStructureLineDTO";
import { IDocumentLineDTO } from "../../dto/IDocumentLineDTO";
import { ISectionDTO } from "../../dto/ISectionDTO";

@Service()
export default class FileManagerService implements IFileManagerService {
  communicator: IRestCommunicator;
  constructor(@Inject(config.repos.file.name) private fileRepo: IFileRepo) {
    this.communicator = Container.get("RestCommunicator");
  }

  async uploadFileForTxtExtraction(
    fileObject: IFileObjectDTO
  ): Promise<Result<IFileDTO>> {
    try {
      const fileUpload = await this.uploadFile(fileObject);
      if (fileUpload.isFailure) {
        throw Result.fail<IResponseDTO<IStructureOutputDTO>>(
          "Error on file upload",
          StatusCodes.FORBIDDEN
        );
      }

      const fileFormatResponse = await this.sendFileToBot(
        FILE_EXTRACTION_TO_TEXT,
        fileObject
      );

      if (fileFormatResponse.success === false) {
        throw Result.fail<IResponseDTO<IStructureOutputDTO>>(
          "Error on file structure request",
          StatusCodes.FORBIDDEN
        );
      }
      return Result.ok<any>(fileFormatResponse.data);
    } catch (e: any) {
      return Result.fail<any>(e.message);
    }
  }

  async uploadFileForStructuring(
    fileObject: IFileObjectDTO,
    titleFormatObject: ITitleFormatDTO
  ): Promise<Result<IStructureOutputDTO>> {
    try {
      const fileUpload = await this.uploadFile(fileObject);
      if (fileUpload.isFailure) {
        throw Result.fail<IResponseDTO<IStructureOutputDTO>>(
          "Error on file upload",
          StatusCodes.FORBIDDEN
        );
      }

      const titleFormatOrError = await this.createTitleFormat(
        titleFormatObject
      );

      if (titleFormatOrError.isFailure) {
        throw Result.fail<TitleFormat>(
          titleFormatOrError.getErrorValue(),
          StatusCodes.FORBIDDEN
        );
      }
      const fileFormatResponse = await this.sendFileFormatToBot(
        FILE_EXTRACTION_WITH_STRUCTURE,
        fileObject,
        titleFormatOrError.getValue()
      );

      if (fileFormatResponse.success === false) {
        throw Result.fail<IResponseDTO<IStructureOutputDTO>>(
          "Error on file structure request",
          StatusCodes.FORBIDDEN
        );
      }
      return Result.ok<any>(fileFormatResponse.data);
    } catch (e: any) {
      return Result.fail<any>(e.message);
    }
  }

  private sendFileFormatToBot(
    endpoint: string,
    fileObject: IFileObjectDTO,
    titleFormatOrError: TitleFormat
  ): Promise<IResponseDTO<any>> {
    const payload = {
      filename: fileObject.fileContent.filename,
      bold: titleFormatOrError.bold.value,
      caps: titleFormatOrError.caps.value,
      color: titleFormatOrError.color.value,
      strings_to_ignore: ["NONE"],
    };
    console.log(payload);

    return this.communicator.sendRequest({
      url: endpoint,
      data: payload,
    });
  }

  private sendFileToBot(
    endpoint: string,
    fileObject: IFileObjectDTO
  ): Promise<IResponseDTO<any>> {
    const payload = {
      filename: fileObject.fileContent.filename,
    };
    return this.communicator.sendRequest({
      url: endpoint,
      data: payload,
    });
  }

  private async createTitleFormat(
    titleFormatObject: ITitleFormatDTO
  ): Promise<Result<TitleFormat>> {
    const bold = await Bold.create(titleFormatObject.bold);
    const caps = await Caps.create(titleFormatObject.caps);
    const color = await Color.create(titleFormatObject.color);

    const titleFormatOrError = await TitleFormat.create({
      bold: bold.getValue(),
      caps: caps.getValue(),
      color: color.getValue(),
    });

    return titleFormatOrError;
  }

  async uploadSingleLineToStructure(
    structuredLine: IStructureLineDTO
  ): Promise<Result<IStructureLineDTO>> {
    try {
      const iteration = structuredLine.iteration;
      const heading = structuredLine.heading;
      const paragraph = structuredLine.paragraph;

      const lineToAdd =
        iteration + "|" + heading + "|" + paragraph + "|" + "english\n";

      const filePath = "/usr/app/file-storage/structured_data.csv";

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
          filePath,
          "iteration|heading|paragraph|language\n",
          "utf8"
        );
      }

      fs.appendFileSync(filePath, lineToAdd, "utf8");

      console.log("New line added to the file.");

      return Result.ok<IStructureLineDTO>(structuredLine);
    } catch (e: any) {
      return Result.fail<IStructureLineDTO>(e.message, StatusCodes.CONFLICT);
    }
  }

  async uploadSingleSectionToStructure(
    section: ISectionDTO
  ): Promise<Result<IStructureLineDTO>> {
    try {
      let heading = "";
      let paragraph = "";
      let structureLine: IStructureLineDTO;
      for (const sectionStructure of section.sectionStructure) {
        if (
          sectionStructure.tag == "H1" ||
          sectionStructure.tag == "H2" ||
          sectionStructure.tag == "H3" ||
          sectionStructure.tag == "H4" ||
          sectionStructure.tag == "H5" ||
          sectionStructure.tag == "H6"
        ) {
          heading += sectionStructure.content;
        } else if (sectionStructure.tag == "P") {
          paragraph += sectionStructure.content;
        }
      }
      structureLine = {
        iteration: section.iteration,
        heading: heading,
        paragraph: paragraph,
      };
      const line = await this.uploadSingleLineToStructure(structureLine);
      if (line.isFailure) {
        throw Result.fail<ISectionDTO[]>(
          "Cannot save information to the model.",
          StatusCodes.CONFLICT
        );
      }
      return Result.ok<IStructureLineDTO>(line.getValue());
    } catch (e: any) {
      return Result.fail<IStructureLineDTO>(e.message, StatusCodes.CONFLICT);
    }
  }

  async uploadMultipleSectionsToStructure(
    sections: ISectionDTO[]
  ): Promise<Result<IStructureLineDTO[]>> {
    let result: IStructureLineDTO[] = [];

    try {
      for (const section of sections) {
        const line = await this.uploadSingleSectionToStructure(section);
        result.push(line.getValue());
      }
      return Result.ok<IStructureLineDTO[]>(result);
    } catch (e: any) {
      return Result.fail<IStructureLineDTO[]>(e.message, StatusCodes.CONFLICT);
    }
  }

  async uploadFile(fileObject: IFileObjectDTO): Promise<Result<IFileDTO>> {
    try {
      //const savedFile = await FileUtils.saveFile(fileObject);

      const fileName = await FileName.create(fileObject.fileContent.filename);
      const fileDescription = await FileDescription.create(
        fileObject.fileDTO.description!
      );
      const fileSize = await FileSize.create(fileObject.fileContent.size);
      const fileExtension = await FileExtension.create(
        fileObject.fileContent.filename
      );
      const fileAccessLevel = await FileAccessLevels.create(
        fileObject.fileDTO.accessLevel!
      );
      const fileGptTrained = await FileGPTTrained.create(false);

      const fileOrError = await File.create({
        filename: fileName.getValue(),
        description: fileDescription.getValue(),
        size: fileSize.getValue(),
        extension: fileExtension.getValue(),
        accessLevel: fileAccessLevel.getValue(),
        gptTrained: fileGptTrained.getValue(),
      });

      if (fileOrError.isFailure) {
        throw Result.fail<File>(
          fileOrError.getErrorValue(),
          StatusCodes.FORBIDDEN
        );
      }

      const fileResult = fileOrError.getValue();

      await this.fileRepo.save(fileResult);
      const fileDTOResult = FileMapper.toDTO(fileResult) as IFileDTO;

      return Result.ok<IFileDTO>(fileDTOResult);
    } catch (e) {
      console.error(e);
      if (fs.existsSync(fileObject.fileContent.path)) {
        await FileUtils.deleteFile(fileObject.fileContent.filename);
      }

      if (e instanceof Error) {
        return Result.fail<IFileDTO>(e.message, StatusCodes.CONFLICT);
      }
      throw e;
    }
  }

  async replaceStructuredFile(
    fileObject: IFileObjectDTO
  ): Promise<Result<any>> {
    try {
      const filename =
        "/usr/app/file-storage/" + fileObject.fileContent.filename;
      const structuredFilename = "/usr/app/file-storage/structured_data.csv";
      const deprecatedfilename =
        "/usr/app/file-storage/" +
        Date.now().toString() +
        "_structured_data_old.csv";

      this.renameFile(structuredFilename, deprecatedfilename);
      this.renameFile(filename, structuredFilename);

      return Result.ok<any>({ success: "File successfully replaced." });
    } catch (e: any) {
      return Result.fail<IFileDTO>(e.message, StatusCodes.CONFLICT);
    }
  }

  async getStructuredFiles(): Promise<Result<IDocumentLineDTO[]>> {
    const fileResponse = await this.communicator.sendGetRequest({
      url: GET_STRUCTURED_TEXT,
    });

    if (fileResponse.success === false) {
      throw Result.fail<IResponseDTO<IStructureOutputDTO>>(
        "Error on file structure request",
        StatusCodes.FORBIDDEN
      );
    }
    return Result.ok<any>(fileResponse.data);
  }

  private renameFile(oldname: string, newname: string) {
    fs.rename(oldname, newname, (error) => {
      if (error) {
        console.error(`Failed to rename file: ${error.message}`);
      } else {
        console.log(`File renamed successfully.`);
      }
    });
  }

  writeSimpleFileToStorage(): Promise<void> {
    const filePath = "/usr/app/file-storage/my-file.txt"; // specify the file path inside the shared volume

    return new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, "Hello world!", (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log("File created and saved!");
          resolve();
        }
      });
    });
  }

  private async deleteFile(fileObj: IFileObjectDTO) {
    if (fs.existsSync(fileObj.fileContent.path)) {
      await FileUtils.deleteFile(fileObj.fileContent.filename);
    }
  }
}
