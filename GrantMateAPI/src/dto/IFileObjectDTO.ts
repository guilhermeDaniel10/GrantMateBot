import { IFileDTO } from "./IFileDTO";

export interface IFileObjectDTO {
  fileDTO: IFileDTO;
  fileContent: Express.Multer.File;
}
