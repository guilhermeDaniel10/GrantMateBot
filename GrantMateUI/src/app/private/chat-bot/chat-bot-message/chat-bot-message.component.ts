import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { OutputMessageModel } from '../model/output-message.model';
import { MainMessageModel } from '../model/main-message.model';
import { DropdownValueConfigs } from '../model/dropdown-value-configs.model';
import { ServiceOutputValueConfigs } from '../model/service-call-automate-model/service-output-value-configs.model';
import { ChatBotService } from '../chat-bot.service';
import { ChatBotMessageService } from './chat-bot-message.service';

@Component({
  selector: 'app-chat-bot-message',
  templateUrl: './chat-bot-message.component.html',
  styleUrls: ['./chat-bot-message.component.scss'],
})
export class ChatBotMessageComponent implements OnInit {
  @Input() message: OutputMessageModel;
  @Output() dropdownSelectionEvent: EventEmitter<DropdownValueConfigs> =
    new EventEmitter();
  @Output() openFieldEvent: EventEmitter<string> = new EventEmitter();
  @Output() decisionButtonEvent: EventEmitter<boolean> = new EventEmitter();
  @Output() messageFullyRendered: EventEmitter<void> = new EventEmitter();
  @Output() submitSelectedInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() submitCustomTextEvent: EventEmitter<string> =
    new EventEmitter<string>();

  mainMessage: MainMessageModel;
  serviceMessage: ServiceOutputValueConfigs[] = [];

  messageContent: string;
  fullMessageContent: string;
  wholeMessageRendered = false;
  typingSpeed = 10;
  decisionButtonEnabled = true;
  shouldHighlightText = false;
  serviceCallRegex = '{{SERVICE_CALL}}';
  selectedText: any;
  customizableText: string;

  constructor(private messageService: ChatBotMessageService) {}

  ngOnInit(): void {
    console.log(this.message);
    this.mainMessage = this.message.mainMessage;
    this.fullMessageContent = this.mainMessage.content;
    this.serviceMessage = this.messageService.processServiceResponse(
      this.message
    );

    this.processMessageConfigs();
    this.typeText();
    this.shouldHighlightText = this.message.mainMessage.selectable;
  }

  typeText() {
    let i = 0;
    const typingInterval = setInterval(() => {
      this.messageContent = this.fullMessageContent.slice(0, ++i);
      if (i === this.fullMessageContent.length) {
        clearInterval(typingInterval);
        this.wholeMessageRendered = true;
        this.messageFullyRendered.emit();
      }
    }, this.typingSpeed);
  }

  processMessageConfigs() {
    if (this.message.mainMessage.customizable) {
      const processedCustomMessage = this.separateCustomMessage(
        this.fullMessageContent
      );
      //this.mainMessage.content = processedCustomMessage[0];
      this.fullMessageContent = processedCustomMessage[0];
      this.customizableText = processedCustomMessage[1];
    }
  }

  separateCustomMessage(message: string): string[] {
    console.log(message);
    const delimiter = '{{custom}}';
    const parts = message.split(delimiter);

    const firstString = parts[0].trim();
    const secondString = parts[1].trim();

    return [firstString, secondString];
  }

  onSubmitCustomText(customText: string) {
    this.submitCustomTextEvent.emit(customText);
  }

  onDropdownSelectionEvent(selectedDropdownOption: DropdownValueConfigs) {
    this.dropdownSelectionEvent.emit(selectedDropdownOption);
  }

  onOpenFieldEvent(openFieldMessage: string) {
    this.openFieldEvent.emit(openFieldMessage);
  }

  onDecisionEvent(selectedOption: boolean) {
    this.decisionButtonEnabled = false;
    this.decisionButtonEvent.emit(selectedOption);
  }

  onSubmitSelectedInfo(selectedText: any) {
    this.submitSelectedInfo.emit(selectedText);
  }

  onSelectedText(text: any) {
    this.selectedText = text;
    console.log(text);
  }
  unSelectText() {
    this.selectedText = '';
  }
}
