import { Result } from "../../core/logic/Result";
import { IDocumentLineDTO } from "../../dto/IDocumentLineDTO";
import { IFileDTO } from "../../dto/IFileDTO";
import { IFileObjectDTO } from "../../dto/IFileObjectDTO";
import { IHierarchyDTO } from "../../dto/IHierarchyDTO";
import { ISectionDTO } from "../../dto/ISectionDTO";
import { ISectionStructureDTO } from "../../dto/ISectionStructureDTO";
import { IStructureLineDTO } from "../../dto/IStructureLineDTO";
import { IStructureOutputDTO } from "../../dto/IStructureOutputDTO";
import { ITitleFormatDTO } from "../../dto/ITitleFormatDTO";

export default interface IFileManagerService {
  writeSimpleFileToStorage(): Promise<void>;
  uploadFile(fileObject: IFileObjectDTO): Promise<Result<IFileDTO>>;
  uploadFileForStructuring(
    fileObject: IFileObjectDTO,
    titleFormatObject: ITitleFormatDTO
  ): Promise<Result<IStructureOutputDTO>>;
  uploadSingleLineToStructure(
    structuredLine: IStructureLineDTO
  ): Promise<Result<IStructureLineDTO>>;
  uploadSingleSectionToStructure(
    structuredSections: ISectionDTO
  ): Promise<Result<IStructureLineDTO>>;
  uploadMultipleSectionsToStructure(
    structuredSections: ISectionDTO[]
  ): Promise<Result<IStructureLineDTO[]>>;
  replaceStructuredFile(fileObject: IFileObjectDTO): Promise<Result<any>>;
  uploadFileForTxtExtraction(
    fileObject: IFileObjectDTO
  ): Promise<Result<IFileDTO>>;
  getStructuredFiles(): Promise<Result<IDocumentLineDTO[]>>;
}
