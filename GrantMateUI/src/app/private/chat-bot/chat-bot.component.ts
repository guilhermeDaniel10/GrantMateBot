import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  IterableDiffer,
  IterableDiffers,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ChatBotService } from './chat-bot.service';
import { ActivatedRoute } from '@angular/router';
import { OutputMessageModel } from './model/output-message.model';
import { InputMessageModel } from './model/input-message.model';
import { DropdownValueConfigs } from './model/dropdown-value-configs.model';
import { UsefulPayloadConfigs } from './model/useful-payload-configs.model';
import { EmbeddingQueryConfigs } from './model/service-response-config.model';
import { ServiceOutputValueConfigs } from './model/service-call-automate-model/service-output-value-configs.model';
import { GPTGenerateConfigs } from './model/gpt-generate-configs.model';
@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss'],
})
export class ChatBotComponent implements OnInit, DoCheck {
  @ViewChild('scrollContainer') private scrollContainer: ElementRef;

  currentChatMessage: OutputMessageModel;
  chatMessages: OutputMessageModel[] = [];
  iterableDiffer: IterableDiffer<any>;

  constructor(
    private chatBotServive: ChatBotService,
    private activatedRoute: ActivatedRoute,
    private iterableDiffers: IterableDiffers
  ) {
    this.iterableDiffer = iterableDiffers.find([]).create(undefined);
  }

  ngOnInit() {
    this.chatBotServive.initiateServicePayload();
    this.getFirstMessage();
  }

  ngDoCheck(): void {
    let changes = this.iterableDiffer.diff(this.chatMessages);
    if (changes) {
      console.log('CHANGED');
    }
  }

  getFirstMessage() {
    this.chatBotServive
      .getFirstMessage()
      .subscribe((message: OutputMessageModel) => {
        this.currentChatMessage = message;
        this.chatMessages.push(message);
      });
  }
  onMessageFullyRendered() {
    const mainMessage = this.currentChatMessage.mainMessage;
    const serviceResponse = this.currentChatMessage.serviceResponse;

    if (
      mainMessage.fromBot &&
      !mainMessage.dropdown &&
      !mainMessage.openField &&
      !serviceResponse &&
      !mainMessage.customizable
    ) {
      this.getNextMessage();
    }
  }

  getNextMessage() {
    const usefulPayload = this.chatBotServive.usefulPayload;
    const inputMessage: InputMessageModel = {
      predefinedMessageId: this.currentChatMessage.mainMessage.id!,
      predefiendMessageNameId: this.currentChatMessage.mainMessage.nameId,
      usefulPayload: usefulPayload,
    };
    this.chatBotServive.getNextMessage(inputMessage).subscribe((message) => {
      this.nextMessageHandling(message);
    });
  }

  nextMessageHandling(outputMessageModel: OutputMessageModel) {
    this.currentChatMessage = outputMessageModel;
    //this.processServiceCallContent(outputMessageModel);
    this.chatMessages.push(outputMessageModel);
    console.log(this.chatMessages);

    //this.currentChatMessage =
    //  this.processServiceCallContent(outputMessageModel);
  }

  processServiceCallContent(
    outputMessage: OutputMessageModel
  ): OutputMessageModel {
    let serviceOutputMessage: ServiceOutputValueConfigs[] = [];
    const serviceResponse = outputMessage.serviceResponse;
    const mainMessage = outputMessage.mainMessage;
    console.log(serviceResponse);
    if (serviceResponse) {
      if (mainMessage.nameId == 'FIND_RELEVANT_INFORMATION_MESSAGE') {
        serviceResponse.map((serviceResponseItem: EmbeddingQueryConfigs) => {
          const serviceOutputValueConfig: ServiceOutputValueConfigs = {
            name: serviceResponseItem.heading,
            content: serviceResponseItem.paragraph,
          };
          serviceOutputMessage.push(serviceOutputValueConfig);
        });
        //outputMessage.formatedServiceResponse = serviceOutputMessage;
      } else if (mainMessage.nameId == 'GENERATE_TEXT_FULL_MESSAGE') {
        const serviceOutputValueConfig: ServiceOutputValueConfigs = {
          content: serviceResponse.generatedText,
        };
        serviceOutputMessage.push(serviceOutputValueConfig);
      }
    }

    return outputMessage;
  }

  onDropdownSelectionChange(selectedDropdownOption: DropdownValueConfigs) {
    const usefulPayload = this.chatBotServive.saveProposalHistory(
      this.currentChatMessage.mainMessage,
      selectedDropdownOption,
      null,
      null,
      null
    );
    const inputMessage = this.instantiateInputMessage(
      this.currentChatMessage.mainMessage.id!,
      this.currentChatMessage.mainMessage.nameId,
      undefined,
      selectedDropdownOption.nameId,
      usefulPayload
    );

    this.getNextMessageWithParams(inputMessage);
  }

  onSubmitCustomText(customText: string) {
    const usefulPayload = this.chatBotServive.saveProposalHistory(
      this.currentChatMessage.mainMessage,
      null,
      null,
      null,
      customText
    );

    const inputMessage = this.instantiateInputMessage(
      this.currentChatMessage.mainMessage.id!,
      this.currentChatMessage.mainMessage.nameId,
      undefined,
      undefined,
      usefulPayload
    );

    this.getNextMessageWithParams(inputMessage);
  }

  onOpenFieldSubmit(openFieldInput: string) {
    const usefulPayload = this.chatBotServive.saveProposalHistory(
      this.currentChatMessage.mainMessage,
      null,
      openFieldInput,
      null,
      null
    );

    const inputMessage = this.instantiateInputMessage(
      this.currentChatMessage.mainMessage.id!,
      this.currentChatMessage.mainMessage.nameId,
      undefined,
      undefined,
      usefulPayload
    );

    this.getNextMessageWithParams(inputMessage);
  }
  onDecisionButtonEvent(selectedDecision: boolean) {
    selectedDecision ? this.getNextMessage() : this.cancelDecisionManager();
  }

  cancelDecisionManager() {
    if (this.currentChatMessage.mainMessage.canCancel) {
      this.getNextMessageWithCancel();
    } else {
      this.goToPreviousMessage();
    }
  }

  getNextMessageWithCancel() {
    const usefulPayload = this.chatBotServive.usefulPayload;
    const inputMessage: InputMessageModel = {
      predefinedMessageId: this.currentChatMessage.mainMessage.id!,
      predefiendMessageNameId: this.currentChatMessage.mainMessage.nameId,
      usefulPayload: usefulPayload,
      canceled: true,
    };
    this.chatBotServive.getNextMessage(inputMessage).subscribe((message) => {
      this.nextMessageHandling(message);
    });
  }

  goToPreviousMessage() {
    this.currentChatMessage = this.chatMessages[this.chatMessages.length - 2];
    this.chatMessages.push(this.currentChatMessage);
    console.log(this.chatMessages);
  }

  onSubmitSelectedInfo(selectedInfo: any) {
    console.log(selectedInfo);
    const usefulPayload = this.chatBotServive.saveProposalHistory(
      this.currentChatMessage.mainMessage,
      null,
      null,
      selectedInfo,
      null
    );

    const inputMessage = this.instantiateInputMessage(
      this.currentChatMessage.mainMessage.id!,
      this.currentChatMessage.mainMessage.nameId,
      undefined,
      undefined,
      usefulPayload
    );

    this.getNextMessageWithParams(inputMessage);
  }

  getNextMessageWithParams(inputMessage: InputMessageModel) {
    this.chatBotServive.getNextMessage(inputMessage).subscribe((message) => {
      this.currentChatMessage = message;
      this.chatMessages.push(message);
      console.log(this.chatMessages);
    });
  }

  instantiateInputMessage(
    predefinedMessageId: number,
    predefiendMessageNameId: string,
    selectedDropdownValueId: number | undefined = undefined,
    selectedDropdownValueNameId: string | undefined = undefined,
    usefulPayload: UsefulPayloadConfigs | undefined = undefined
  ): InputMessageModel {
    const inputMessage: InputMessageModel = {
      predefinedMessageId: predefinedMessageId,
      predefiendMessageNameId: predefiendMessageNameId,
      selectedDropdownValueId: selectedDropdownValueId,
      selectedDropdownValueNameId: selectedDropdownValueNameId,
      usefulPayload: usefulPayload,
    };
    return inputMessage;
  }
}
