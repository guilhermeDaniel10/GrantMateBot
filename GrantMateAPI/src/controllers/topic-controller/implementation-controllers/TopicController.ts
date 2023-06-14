import { Inject, Service } from "typedi";
import ITopicController from "../interface-controllers/ITopicController";
import config from "../../../config";
import { Request, Response, NextFunction } from "express";
import ITopicService from "../../../services/interface_services/ITopicService";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

@Service()
export default class TopicController implements ITopicController {
  constructor(
    @Inject(config.services.topic.name)
    private topicServiceInstance: ITopicService
  ) {}

  async findTopicByPromptTopKSearch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const k_number = req.body.k_number;
      const topic = req.body.topic;
      const response =
        await this.topicServiceInstance.findTopicByPromptTopKSearch(
          k_number,
          topic
        );

      const retDTO = response.getValue();

      return res.json(retDTO).status(201);
    } catch (e) {
      console.log(e);
      return next(e);
    }
  }

  test(req: any, res: any, next: any) {
    return res.json({ test: true }).status(201);
  }
}
