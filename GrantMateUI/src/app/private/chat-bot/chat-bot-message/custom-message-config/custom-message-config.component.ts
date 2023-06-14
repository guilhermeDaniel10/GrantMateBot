import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-message-config',
  templateUrl: './custom-message-config.component.html',
  styleUrls: ['./custom-message-config.component.scss'],
})
export class CustomMessageConfigComponent {
  @Input() customizableText: string;
  @Output() submitCustomTextEvent: EventEmitter<string> =
    new EventEmitter<string>();

  onSubmitCustomText() {
    this.submitCustomTextEvent.emit(this.customizableText);
  }
}
