import { Injectable } from '@angular/core';
import { OutputMessageModel } from '../model/output-message.model';
import { ServiceOutputValueConfigs } from '../model/service-call-automate-model/service-output-value-configs.model';

@Injectable({
  providedIn: 'root',
})
export class ChatBotMessageService {
  constructor() {}

  highlitableText = ['TBD'];
  hightableServiceResponse = ['FIND_RELEVANT_INFORMATION_K_SEARCH'];

  processServiceResponse(
    message: OutputMessageModel
  ): ServiceOutputValueConfigs[] {
    const formatedServiceResponse: ServiceOutputValueConfigs[] = [];

    if (message.serviceResponse) {
      if (message.serviceResponse.length > 0) {
        const serviceResponse = message.serviceResponse;

        serviceResponse.forEach((element: any) => {
          if (
            message.mainMessage.serviceCall.nameId ==
            'FIND_RELEVANT_INFORMATION_K_SEARCH'
          ) {
            const serviceOutputValueConfigs: ServiceOutputValueConfigs = {
              name: element.heading,
              content: element.paragraph,
            };
            formatedServiceResponse.push(serviceOutputValueConfigs);
          }
        });
      } else {
        const serviceOutputValueConfigs: ServiceOutputValueConfigs = {
          content: message.serviceResponse.generatedText,
        };
        formatedServiceResponse.push(serviceOutputValueConfigs);
      }
    }
    return formatedServiceResponse;
  }
}
