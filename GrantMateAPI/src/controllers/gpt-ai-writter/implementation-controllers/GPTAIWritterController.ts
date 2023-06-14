import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import config from "../../../config";
import IGPTAIWritterController from "../interface-controllers/IGPTAIWritterController";
import IGPTWritterService from "../../../services/interface_services/IGPTWritterService";

@Service()
export default class GPTAIWritterController implements IGPTAIWritterController {
  constructor(
    @Inject(config.services.gptWritter.name)
    private gptWritterServiceInstance: IGPTWritterService
  ) {}
}
