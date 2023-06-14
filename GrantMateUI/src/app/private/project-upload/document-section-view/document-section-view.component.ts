import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DocumentSection } from 'src/app/core/models/document-section.model';
import { HighlightSection } from 'src/app/core/models/section-highlight.model';
import { SelectedValues } from 'src/app/core/models/selected-values.model';

@Component({
  selector: 'app-document-section-view',
  templateUrl: './document-section-view.component.html',
  styleUrls: ['./document-section-view.component.scss'],
})
export class DocumentViewComponent implements OnChanges {
  @Input() highlightedSection: HighlightSection;
  @Input() selectedSection: HighlightSection;
  @Output() submit: EventEmitter<DocumentSection> = new EventEmitter();

  selectedValues: SelectedValues = {
    selectedHeading: '',
    selectedParagraph: '',
  };

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['highlightedSection']) {
      this.updateSelectedValuesOnSectionChange();
    }

    if (changes['selectedSection']) {
      this.selectedSection = changes['selectedSection'].currentValue;
      this.updateSelectedSection();
    }
  }

  updateSelectedValuesOnSectionChange() {
    this.selectedValues.selectedHeading = this.highlightedSection
      .selectedSection
      ? this.highlightedSection.selectedSection + ' '
      : '';
    this.selectedValues.selectedParagraph = '';
  }

  updateSelectedSection() {
    this.selectedValues.selectedHeading =
      this.selectedSection.selectedSection;
    this.selectedValues.selectedParagraph =
      this.selectedSection.selectedText;
  }

  headingBlock() {
    this.selectedValues.selectedHeading +=
      this.highlightedSection.selectedText + ' ';
  }

  paragraphBlock() {
    this.selectedValues.selectedParagraph +=
      this.highlightedSection.selectedText + ' ';
  }

  resetHeadingBlock() {
    this.selectedValues.selectedHeading = '';
  }

  resetParagraphBlock() {
    this.selectedValues.selectedParagraph = '';
  }

  resetSelectedValues() {
    this.selectedValues.selectedHeading = this.highlightedSection
      .selectedSection
      ? this.highlightedSection.selectedSection + ' '
      : '';
    this.selectedValues.selectedParagraph = '';
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key == 'p' && event.altKey) {
      this.paragraphBlock();
    } else if (event.key == 't' && event.altKey) {
      this.headingBlock();
    } else if (event.key == 'Backspace' && event.altKey) {
      this.resetSelectedValues();
    } else if (event.key === 'Enter' && event.shiftKey) {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (
      this.selectedValues.selectedHeading === '' ||
      !this.selectedValues.selectedHeading ||
      this.selectedValues.selectedParagraph === '' ||
      !this.selectedValues.selectedParagraph
    ) {
      console.error('Please select a heading and a paragraph');
      return;
    }

    //heading without newlines
    const heading = this.selectedValues.selectedHeading.replace(
      /(\r\n|\n|\r)/gm,
      ''
    );
    const paragraph = this.selectedValues.selectedParagraph.replace(
      /(\r\n|\n|\r)/gm,
      ''
    );

    const documentSectionLine: DocumentSection = {
      heading: `${this.highlightedSection.selectedTypeOfProposal} ${heading}`,
      paragraph: paragraph,
    };
    this.submit.emit(documentSectionLine);
    this.resetSelectedValues();
  }
}
