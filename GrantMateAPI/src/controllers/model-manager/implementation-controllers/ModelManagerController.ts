import { Request, Response, NextFunction } from "express";
import { Inject, Service } from "typedi";
import config from "../../../config";
import { GPT_2, GPT_3, HUGGING_FACE } from "../../../constants/AIModelConstants";
import { GENERATE_TEXT_VIA_PROMPT, TOPIC_SEARCH } from "../../../constants/KafkaStreamTypeConstants";
import { IPromptDTO } from "../../../dto/IPromptDTO";
import IModelManagerService from "../../../services/interface_services/IModelManagerService";
import IModelManagerController from "../interface-controllers/IModelManagerController";

@Service()
export default class ModelManagerController implements IModelManagerController {
  constructor(
    @Inject(config.services.modelManager.name)
    private modelManagerServiceInstance: IModelManagerService
  ) {}
  async generateTextViaPrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const prompDTO: IPromptDTO = {
        prompt: req.body.prompt,
        model: GPT_2,
        streamType: GENERATE_TEXT_VIA_PROMPT,
      };

      const generateTextPrompt =
        await this.modelManagerServiceInstance.generateTextViaPrompt(prompDTO);

      const retDTO = generateTextPrompt.getValue();
      return res.json(retDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async generateTextViaPromptGpt3(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const prompDTO: IPromptDTO = {
        prompt: req.body.prompt,
        model: GPT_3,
        streamType: GENERATE_TEXT_VIA_PROMPT,
      };

      const generateTextPrompt =
        await this.modelManagerServiceInstance.generateTextViaPrompt(prompDTO);

      const retDTO = generateTextPrompt.getValue();
      return res.json(retDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  async topicSearch(req: Request, res: Response, next: NextFunction) {
    try {
      const prompDTO: IPromptDTO = {
        prompt: req.body.prompt,
        model: HUGGING_FACE,
        streamType: TOPIC_SEARCH,
      };

      const generateTextPrompt =
        await this.modelManagerServiceInstance.topicSearch(prompDTO);

      const retDTO = generateTextPrompt.getValue();
      return res.json(retDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }
}
