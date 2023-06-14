import { Component, EventEmitter, Output } from '@angular/core';
import { POSSIBLE_TAGS } from 'src/app/core/constants/possible-tags.constants';

@Component({
  selector: 'app-tag-radio-selection',
  templateUrl: './tag-radio-selection.component.html',
  styleUrls: ['./tag-radio-selection.component.scss'],
})
export class TagRadioSelectionComponent {
  @Output() tagSelectionChange: EventEmitter<string> = new EventEmitter();

  selectedTag: string;
  possibleTags = POSSIBLE_TAGS;

  onTagSelectionChange(): void {
    this.tagSelectionChange.emit(this.selectedTag);
  }
}
