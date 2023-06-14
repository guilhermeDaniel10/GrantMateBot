import { Request, Response, NextFunction } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";
import { IFileDTO } from "../../../dto/IFileDTO";
import { IFileObjectDTO } from "../../../dto/IFileObjectDTO";
import IFileManagerService from "../../../services/interface_services/IFileManagerService";
import IFileManagerController from "../interface-controllers/IFileManagerController";
import { ITitleFormatDTO } from "../../../dto/ITitleFormatDTO";
import path from "path";
import { IStructureLineDTO } from "../../../dto/IStructureLineDTO";
import { ISectionDTO } from "../../../dto/ISectionDTO";
import { IHierarchyDTO } from "../../../dto/IHierarchyDTO";
import IHierarchyManagerService from "../../../services/interface_services/IHierarchyManagerService";

@Service()
export default class FileManagerController implements IFileManagerController {
  constructor(
    @Inject(config.services.fileManager.name)
    private fileServiceInstance: IFileManagerService,
    @Inject(config.services.hierarchy.name)
    private hierarchyManagerInstance: IHierarchyManagerService
  ) {}

  async singleFileExtraction(req: any, res: any, next: any) {
    try {
      const fileDTO: IFileDTO = {
        filename: req.file!.originalname,
        description: req.body.description,
        accessLevel: req.body.accessLevel,
        gptTrained: true,
      };
      const fileObjectDTO: IFileObjectDTO = {
        fileDTO: fileDTO,
        fileContent: req.file!,
      };

      const fileUploadOrError =
        await this.fileServiceInstance.uploadFileForTxtExtraction(
          fileObjectDTO
        );

      if (fileUploadOrError.isFailure) {
        return res
          .status(fileUploadOrError.getErrorCode())
          .send(fileUploadOrError.getValue());
      }

      const retFileDTO = fileUploadOrError.getValue();
      return res.json(retFileDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  uploadHierarchy(req: any, res: any, next: any) {
    try {
      const titlesArray = req.body;

      let hierarchyDTO: IHierarchyDTO[] = [];
      titlesArray.forEach((title: any) => {
        hierarchyDTO.push({
          h1Content: title.h1Content,
          h2Sections: title.h2Sections,
          paragraphsSections: title.paragraphsSections,
        });
      });
      this.hierarchyManagerInstance.uploadHierarchy(hierarchyDTO);
      return res.json(hierarchyDTO).status(201);
    } catch (error) {
      console.log(error);
      return next(error);
    }
  }

  async uploadFileForStructuring(req: any, res: any, next: any) {
    try {
      const fileDTO: IFileDTO = {
        filename: req.file!.originalname,
        description: req.body.description,
        accessLevel: req.body.accessLevel,
        gptTrained: false,
      };
      const fileObjectDTO: IFileObjectDTO = {
        fileDTO: fileDTO,
        fileContent: req.file!,
      };

      const titleFormatDTO: ITitleFormatDTO = {
        bold: req.body.bold,
        caps: req.body.caps,
        color: req.body.color,
      };

      const fileUploadOrError =
        await this.fileServiceInstance.uploadFileForStructuring(
          fileObjectDTO,
          titleFormatDTO
        );

      if (fileUploadOrError.isFailure) {
        return res
          .status(fileUploadOrError.getErrorCode())
          .send(fileUploadOrError.getValue());
      }

      const retFileDTO = fileUploadOrError.getValue();
      return res.json(retFileDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async uploadSingleLineToStructure(req: any, res: any, next: any) {
    try {
      const structureLineDTO: IStructureLineDTO = {
        iteration: 0,
        heading: req.body.heading,
        paragraph: req.body.paragraph,
      };

      const lineUploadOrError =
        await this.fileServiceInstance.uploadSingleLineToStructure(
          structureLineDTO
        );

      if (lineUploadOrError.isFailure) {
        return res
          .status(lineUploadOrError.getErrorCode())
          .send(lineUploadOrError.getValue());
      }

      const lineUploadDTO = lineUploadOrError.getValue();
      return res.json(lineUploadDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async uploadSingleSectionToStructure(req: any, res: any, next: any) {
    try {
      const sectionDTO: ISectionDTO = req.body;

      const sectionUploadOrError =
        await this.fileServiceInstance.uploadSingleSectionToStructure(
          sectionDTO
        );

      if (sectionUploadOrError.isFailure) {
        return res
          .status(sectionUploadOrError.getErrorCode())
          .send(sectionUploadOrError.getValue());
      }

      const sectionUploadDTO = sectionUploadOrError.getValue();
      return res.json(sectionUploadDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async uploadMultipleSectionsToStructure(req: any, res: any, next: any) {
    try {
      const sectionsDTO: ISectionDTO[] = req.body;

      const sectionsUploadOrError =
        await this.fileServiceInstance.uploadMultipleSectionsToStructure(
          sectionsDTO
        );

      if (sectionsUploadOrError.isFailure) {
        return res
          .status(sectionsUploadOrError.getErrorCode())
          .send(sectionsUploadOrError.getValue());
      }

      const sectionUploadDTO = sectionsUploadOrError.getValue();
      return res.json(sectionUploadDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async downloadFile(req: any, res: any, next: any) {
    try {
      let fileName = req.param("filename");
      const filePath = "/usr/app/file-storage";
      const file = path.resolve(filePath + "/" + fileName);
      res.download(file);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async getStructuredFiles(req: any, res: any, next: any) {
    try {
      const fileUploadOrError =
        await this.fileServiceInstance.getStructuredFiles();

      if (fileUploadOrError.isFailure) {
        return res
          .status(fileUploadOrError.getErrorCode())
          .send(fileUploadOrError.getValue());
      }

      const retFileDTO = fileUploadOrError.getValue();
      return res.json(retFileDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async uploadFile(req: any, res: any, next: any) {
    try {
      const fileDTO: IFileDTO = {
        filename: req.file!.originalname,
        description: req.body.description,
        accessLevel: req.body.accessLevel,
        gptTrained: false,
      };
      const fileObjectDTO: IFileObjectDTO = {
        fileDTO: fileDTO,
        fileContent: req.file!,
      };

      const fileUploadOrError = await this.fileServiceInstance.uploadFile(
        fileObjectDTO
      );

      if (fileUploadOrError.isFailure) {
        return res
          .status(fileUploadOrError.getErrorCode())
          .send(fileUploadOrError.getErrorValue());
      }

      const retFileDTO = fileUploadOrError.getValue();
      return res.json(retFileDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async writeSimpleFileToStorage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      await this.fileServiceInstance.writeSimpleFileToStorage();
      return res.json({ test: "success" }).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  uploadStructuredFile(req: any, res: any, next: any) {
    try {
      const fileDTO: IFileDTO = {
        filename: req.file!.originalname,
        description: req.body.description,
        accessLevel: req.body.accessLevel,
        gptTrained: false,
      };
      return res.json({ test: "success" }).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async replaceStructuredFile(req: any, res: any, next: any) {
    try {
      const fileDTO: IFileDTO = {
        filename: req.file!.originalname,
      };
      const fileObjectDTO: IFileObjectDTO = {
        fileDTO: fileDTO,
        fileContent: req.file!,
      };

      const replaceFileOrError =
        await this.fileServiceInstance.replaceStructuredFile(fileObjectDTO);

      if (replaceFileOrError.isFailure) {
        return res
          .status(replaceFileOrError.getErrorCode())
          .send(replaceFileOrError.getErrorValue());
      }

      const retFileDTO = replaceFileOrError.getValue();
      return res.json(retFileDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
}
