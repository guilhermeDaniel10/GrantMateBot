import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DropdownConfigs } from '../../model/dropdown-configs.model';
import { DropdownValueConfigs } from '../../model/dropdown-value-configs.model';

@Component({
  selector: 'app-dropdown-config',
  templateUrl: './dropdown-config.component.html',
  styleUrls: ['./dropdown-config.component.scss'],
})
export class DropdownConfigComponent {
  @Input() dropdownConfigs: DropdownConfigs;
  @Output() dropdownSelectionEvent: EventEmitter<DropdownValueConfigs> =
    new EventEmitter();

  disabled = false;

  onDropdownSelectionEvent(selectedOption: any) {
    const selectedOptionValue = selectedOption.target.value;
    this.dropdownConfigs.dropdownValues.forEach((dropdownValue) => {
      if (dropdownValue.nameId === selectedOptionValue) {
        this.dropdownSelectionEvent.emit(dropdownValue);
        return;
      }
    });
  }

  onDropdownButtonSelectionEvent(selectedOption: DropdownValueConfigs) {
    this.disabled = true;
    this.dropdownSelectionEvent.emit(selectedOption);
  }
}
