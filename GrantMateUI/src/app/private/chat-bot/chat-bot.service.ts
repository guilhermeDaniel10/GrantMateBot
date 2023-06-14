import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/app/environment';
import { OutputMessageModel } from './model/output-message.model';
import { InputMessageModel } from './model/input-message.model';
import { MainMessageModel } from './model/main-message.model';
import { DropdownValueConfigs } from './model/dropdown-value-configs.model';
import { UsefulPayloadConfigs } from './model/useful-payload-configs.model';
import { ServiceOutputValueConfigs } from './model/service-call-automate-model/service-output-value-configs.model';

@Injectable({
  providedIn: 'root',
})
export class ChatBotService {
  apiUrl: string = `${environment.apiUrl}/chat`;

  usefulPayload: UsefulPayloadConfigs = { k_number: 3 };

  constructor(private http: HttpClient) {}

  initiateServicePayload() {
    this.usefulPayload = {
      PROPOSAL_TYPE: ' ',
      TOPIC: ' ',
      KEYWORDS: ' ',
      SELECTED_INFORMATION: ' ',
      THEME: ' ',
      k_number: 3, //for text query
      text: ' ',
    };
  }

  getFirstMessage() {
    return this.http
      .get<OutputMessageModel>(`${this.apiUrl}/initial-message`)
      .pipe(catchError(this.error));
  }

  getNextMessage(inputMessage: InputMessageModel) {
    if (inputMessage.predefiendMessageNameId == 'FIND_RELEVANT_INFORMATION') {
      this.textQueryBuild();
    }
    return this.http
      .post<OutputMessageModel>(`${this.apiUrl}/next-message`, inputMessage)
      .pipe(catchError(this.error));
  }

  textQueryBuild() {
    const textQueryConfig = `${this.usefulPayload.PROPOSAL_TYPE} ${this.usefulPayload.TOPIC} ${this.usefulPayload.KEYWORDS}`;
    localStorage.setItem('text', textQueryConfig);
    this.usefulPayload.text = textQueryConfig;
  }

  saveProposalHistory(
    mainMessage: MainMessageModel,
    selectedDropdownOption: DropdownValueConfigs | null,
    openFieldMessage: string | null,
    selectedInfo: any,
    customText: string | null
  ): UsefulPayloadConfigs {
    if (selectedDropdownOption) {
      if (mainMessage.nameId == 'TYPE_OF_PROPOSAL_SELECTION') {
        const proposalType = selectedDropdownOption.content;
        localStorage.setItem('PROPOSAL_TYPE', proposalType);
        this.usefulPayload.PROPOSAL_TYPE = proposalType;
      }

      if (
        mainMessage.nameId == 'TOPIC_SELECTION_EUROSTARS' ||
        mainMessage.nameId == 'TOPIC_SELECTION_HORIZON'
      ) {
        localStorage.setItem('TOPIC', '');
        let topic = ' ';
        if (!selectedDropdownOption.nameId.includes('NONE')) {
          topic = selectedDropdownOption.content;
        }
        
        localStorage.setItem('TOPIC', topic);
        this.usefulPayload.TOPIC = topic;
      } else if (
        mainMessage.nameId == 'TOPIC_SELECTION_HORIZON_EXCELLENCE' ||
        mainMessage.nameId == 'TOPIC_SELECTION_HORIZON_IMPACT' ||
        mainMessage.nameId == 'TOPIC_SELECTION_HORIZON_IMPLEMENTATION'
      ) {
        const topicInStorage = localStorage.getItem('TOPIC') || '';
        let topic = topicInStorage;
        if (!selectedDropdownOption.nameId.includes('NONE')) {
          topic = topicInStorage + ' ' + selectedDropdownOption.content;
        }
        localStorage.setItem('SECTION', topic);
        this.usefulPayload.TOPIC = topic;
      }
    } else if (openFieldMessage) {
      if (mainMessage.nameId == 'INSPIRING_PROPOSAL_INPUT') {
        const keywords = openFieldMessage;
        localStorage.setItem('KEYWORDS', keywords);
        this.usefulPayload.KEYWORDS = keywords;
      } else if (mainMessage.nameId == 'THEME_INPUT') {
        const theme = openFieldMessage;
        localStorage.setItem('THEME', theme);
        this.usefulPayload.THEME = theme;
      }
    } else if (selectedInfo) {
      if (mainMessage.nameId == 'FIND_RELEVANT_INFORMATION_MESSAGE') {
        const selectedInformation = selectedInfo.content;
        localStorage.setItem('SELECTED_INFORMATION', selectedInformation);
        this.usefulPayload.SELECTED_INFORMATION = selectedInformation;
      }
    } else if (customText) {
      if (mainMessage.nameId == 'CUSTOMIZABLE_SELECTED_TOPIC_INPUT') {
        const customTopic = customText;
        localStorage.setItem('SELECTED_INFORMATION', customTopic);
        this.usefulPayload.SELECTED_INFORMATION = customTopic;
      }
    }

    return this.usefulPayload;
  }

  getUsefulPayload() {
    return this.usefulPayload;
  }

  // Handle Errors
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
