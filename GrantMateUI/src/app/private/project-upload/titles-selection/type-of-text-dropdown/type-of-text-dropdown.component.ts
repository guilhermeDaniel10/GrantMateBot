import { Component } from '@angular/core';
import { POSSIBLE_TAGS } from 'src/app/core/constants/possible-tags.constants';

@Component({
  selector: 'app-type-of-text-dropdown',
  templateUrl: './type-of-text-dropdown.component.html',
  styleUrls: ['./type-of-text-dropdown.component.scss'],
})
export class TypeOfTextDropdownComponent {
  typesOfText = POSSIBLE_TAGS;

  selectedTypeOfText: string = 'H1';
}
