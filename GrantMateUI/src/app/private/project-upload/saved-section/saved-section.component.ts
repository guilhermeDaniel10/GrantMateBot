import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DocumentSection } from 'src/app/core/models/document-section.model';

@Component({
  selector: 'app-saved-section',
  templateUrl: './saved-section.component.html',
  styleUrls: ['./saved-section.component.scss'],
})
export class SavedSectionComponent implements OnInit, OnChanges {
  @Input() savedSections: DocumentSection[];

  ngOnInit(): void {
    console.log(this.savedSections);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['savedSections']) {
      this.savedSections = changes['savedSections'].currentValue;
    }
  }
}
