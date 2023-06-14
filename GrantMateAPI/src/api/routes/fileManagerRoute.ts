import { Router } from "express";
import Container from "typedi";
import config from "../../config";
import { Joi, celebrate } from "celebrate";
import IFileManagerController from "../../controllers/file-manager/interface-controllers/IFileManagerController";
import multer from "multer";
import storage from "../middlewares/file-upload";

const route = Router();

export default (app: Router) => {
  const upload = multer({ storage: storage });

  app.use("/file", route);
  const ctrl = Container.get(
    config.controllers.fileManager.name
  ) as IFileManagerController;

  route.post("/simple-extraction", upload.single("file"), (req, res, next) =>
    ctrl.singleFileExtraction(req, res, next)
  );

  route.post(
    "/extraction",
    upload.single("file"),
    celebrate({
      body: Joi.object({
        description: Joi.string(),
        accessLevel: Joi.string(),
        bold: Joi.boolean(),
        caps: Joi.boolean(),
        color: Joi.string(),
      }),
    }),
    (req, res, next) => ctrl.uploadFileForStructuring(req, res, next)
  );

  route.post(
    "/hierarchy",
    celebrate({
      body: Joi.array().items({
        h1Content: Joi.string(),
        h2Sections: Joi.array().items({
          h2Content: Joi.string(),
          h3Sections: Joi.array().items({
            h3Content: Joi.string(),
            paragraphsSections: Joi.array().items(),
          }),
          paragraphsSections: Joi.array().items(),
        }),
        paragraphsSections: Joi.array().items(),
      }),
    }),
    (req, res, next) => ctrl.uploadHierarchy(req, res, next)
  );

  route.post(
    "/structured/line",
    celebrate({
      body: Joi.object({
        heading: Joi.string(),
        paragraph: Joi.string(),
      }),
    }),
    (req, res, next) => ctrl.uploadSingleLineToStructure(req, res, next)
  );

  route.post(
    "/structured/section/multiple",
    celebrate({
      body: Joi.array().items({
        iteration: Joi.number(),
        sectionStructure: Joi.array().items({
          tag: Joi.string(),
          content: Joi.string(),
        }),
      }),
    }),
    (req, res, next) => ctrl.uploadMultipleSectionsToStructure(req, res, next)
  );

  route.post(
    "/structured/section",
    celebrate({
      body: Joi.object({
        iteration: Joi.number(),
        sectionStructure: Joi.array().items({
          tag: Joi.string(),
          content: Joi.string(),
        }),
      }),
    }),
    (req, res, next) => ctrl.uploadSingleSectionToStructure(req, res, next)
  );

  route.post(
    "",
    upload.single("file"),
    celebrate({
      body: Joi.object({
        description: Joi.string(),
        accessLevel: Joi.string(),
      }),
    }),
    (req, res, next) => ctrl.uploadFile(req, res, next)
  );

  route.post(
    "/structured",
    upload.single("file"),
    celebrate({
      body: Joi.object({
        description: Joi.string(),
        accessLevel: Joi.string(),
      }),
    }),
    (req, res, next) => ctrl.uploadStructuredFile(req, res, next)
  );

  route.get("/structured", (req, res, next) =>
    ctrl.getStructuredFiles(req, res, next)
  );

  route.put("/structured", upload.single("file"), (req, res, next) =>
    ctrl.replaceStructuredFile(req, res, next)
  );

  //Endpoint just to test the file submission without the multer middleware
  route.get(
    "/test",
    celebrate({
      body: Joi.object({
        systemRoleName: Joi.string().required(),
      }),
    }),
    (req, res, next) => ctrl.writeSimpleFileToStorage(req, res, next)
  );

  route.get("/download/:filename", (req, res, next) =>
    ctrl.downloadFile(req, res, next)
  );
};
