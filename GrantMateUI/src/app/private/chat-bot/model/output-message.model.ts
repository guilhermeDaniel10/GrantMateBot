import { MainMessageModel } from './main-message.model';
import { ServiceOutputValueConfigs } from './service-call-automate-model/service-output-value-configs.model';
import { EmbeddingQueryConfigs } from './service-response-config.model';

export interface OutputMessageModel {
  mainMessage: MainMessageModel;
  serviceResponse: any;
  formatedServiceResponse?: any;
}
