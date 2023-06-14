import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-open-field-config',
  templateUrl: './open-field-config.component.html',
  styleUrls: ['./open-field-config.component.scss'],
})
export class OpenFieldConfigComponent {
  @Output() openFieldEvent: EventEmitter<string> = new EventEmitter();
  openFieldMessage: string = '';
  enabledSubmitButton = true;

  onOpenFieldEvent() {
    this.enabledSubmitButton = false;
    this.openFieldEvent.emit(this.openFieldMessage);
  }
}
