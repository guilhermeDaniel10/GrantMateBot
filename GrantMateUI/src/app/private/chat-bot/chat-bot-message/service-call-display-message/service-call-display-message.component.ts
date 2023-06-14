import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MainMessageModel } from '../../model/main-message.model';
import { ServiceOutputValueConfigs } from '../../model/service-call-automate-model/service-output-value-configs.model';
import { OutputMessageModel } from '../../model/output-message.model';

@Component({
  selector: 'app-service-call-display-message',
  templateUrl: './service-call-display-message.component.html',
  styleUrls: ['./service-call-display-message.component.scss'],
})
export class ServiceCallDisplayMessageComponent implements OnInit {
  @Input() serviceMessage: ServiceOutputValueConfigs[];
  @Input() selectable: boolean = false;

  @Output() submitSelectedInfo: EventEmitter<any> = new EventEmitter<any>();

  selectedText: any;

  shouldHighlightServiceCall = false;

  ngOnInit(): void {}

  onSelectedText(text: any) {
    this.selectedText = text;
    console.log(text);
  }
  unSelectText() {
    this.selectedText = '';
  }

  onSubmitSelectedInfo() {
    this.submitSelectedInfo.emit(this.selectedText);
  }
}
