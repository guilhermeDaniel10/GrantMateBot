import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TextSelectEvent } from './text-select-event.directive';
import { ViewportScroller } from '@angular/common';
import { FileLine } from 'src/app/core/models/file-line.model';
import { DocumentSectionNumeric } from 'src/app/core/models/document-section-numeric.model';

interface SelectedValues {
  selectedHeading: string | undefined;
  selectedParagraph: string | undefined;
}

interface SelectionRectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

interface ShowableText {
  content: string;
  highlight: boolean;
}

@Component({
  selector: 'app-text-selection',
  templateUrl: './text-selection.component.html',
  styleUrls: ['./text-selection.component.scss'],
})
export class TextSelectionComponent implements OnInit, OnChanges {
  //MUDEI DE STRING PARA FILELINE, É SO MUDAR ISSO E METER CORRETO O HTML
  @Input() textAsArray: FileLine[];
  @Input() topicToSearch: string = '';
  @Output() textSelectEvent: EventEmitter<string> = new EventEmitter();
  @Output() textSelectEventAsNumeric: EventEmitter<DocumentSectionNumeric> =
    new EventEmitter();
  @ViewChild('selectionZone') selectionZone: ElementRef;

  numberOfFollowingLines: number = 10;
  numberOfLinesToAddToTitle: number = 0;
  currentLastFollowingHighlighted: number;
  textToShow: string = '';
  searchTerm: string = '';
  textToHighlight: string = '';
  foundIndexes: number[] = [];
  currentSearchTermIndex: number = -1;
  showableText: ShowableText[] = [];

  constructor(private scroller: ViewportScroller) {
    this.hostRectangle = null;
    this.selectedText = '';
  }

  selectedValues: SelectedValues = {
    selectedHeading: undefined,
    selectedParagraph: undefined,
  };

  highlitedText: string = '';

  ngOnInit(): void {
    if (this.topicToSearch) this.searchTerm = this.topicToSearch;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['topicToSearch'] &&
      this.textAsArray &&
      this.textAsArray.length > 0
    ) {
      this.searchTerm = changes['topicToSearch'].currentValue;
      this.changeHighlightText();
    }
  }

  changeHighlightText() {
    this.textToHighlight = this.searchTerm;
    this.findIndexesOfSearchTerm();

    if (this.foundIndexes.length > 0) {
      this.scrollToFoundValue(0);
    }
  }

  scrollToFoundValue(index: number) {
    if (this.foundIndexes.length > 0) {
      const element = this.selectionZone.nativeElement.querySelector(
        `#highlight-${this.foundIndexes[index]}`
      );
      const topPos = element.offsetTop - 100;

      if (element) {
        this.resetAllHighlithingVariables();

        this.instantiateIndexesToHighlight(this.foundIndexes[index]);

        this.selectionZone.nativeElement.scrollTop = topPos;
        //element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  instantiateIndexesToHighlight(index: number) {
    this.numberOfFollowingLines = 10;
    this.indexesToHighlightAsTitle = [index];

    for (let i = 1; i <= this.numberOfFollowingLines; i++) {
      this.indexesToHighlightAsParagraph.push(index + i);
    }

    this.highlightText();
  }

  scrollToNextFoundValue() {
    this.foundIndexes.indexOf(this.currentSearchTermIndex);
    if (this.currentSearchTermIndex < this.foundIndexes.length - 1) {
      this.currentSearchTermIndex += 1;
      this.scrollToFoundValue(this.currentSearchTermIndex);
    }
  }

  scrollToPreviousFoundValue() {
    if (this.currentSearchTermIndex > 0) {
      this.currentSearchTermIndex -= 1;
      this.scrollToFoundValue(this.currentSearchTermIndex);
    }
  }

  findIndexesOfSearchTerm() {
    this.findIndexesWhereSearchTermIsFound(this.searchTerm.toLowerCase());
    if (this.foundIndexes.length > 0) {
      this.currentSearchTermIndex = 0;
    }
  }

  findIndexesWhereSearchTermIsFound(searchText: string) {
    this.foundIndexes = [];

    for (let i = 0; i < this.textAsArray.length; i++) {
      if (this.textAsArray[i].content.toLowerCase().includes(searchText)) {
        this.foundIndexes.push(i);
      }
    }
  }

  // ------------------------- HIGHLIGHT HANDLING -------------------------
  indexesToHighlightAsTitle: number[] = [];
  indexesToHighlightAsParagraph: number[] = [];
  lastHighlightedTitleFlag: number = 0;
  lastHighlightedParagraphFlag: number = 10;

  changeTitleHighlight() {
    const isTitleIncrement =
      this.lastHighlightedTitleFlag < this.numberOfLinesToAddToTitle;

    if (isTitleIncrement) {
      this.increaseTitleAndDecreaseParagraph();
    } else {
      this.decreaseTitleAndIncreaseParagraph();
    }

    this.numberOfFollowingLines = this.indexesToHighlightAsParagraph.length;
    this.highlightText();
  }

  changeParagraphHighlight() {
    const isParagraphIncrement =
      this.lastHighlightedParagraphFlag < this.numberOfFollowingLines;

    if (isParagraphIncrement) {
      this.increaseParagraph();
    } else {
      this.decreaseParagraph();
    }

    this.numberOfLinesToAddToTitle = this.indexesToHighlightAsTitle.length;
    this.highlightText();
  }

  increaseParagraph() {
    this.sortIndexesToHighlight();
    this.indexesToHighlightAsParagraph.push(
      this.indexesToHighlightAsParagraph[
        this.indexesToHighlightAsParagraph.length - 1
      ] + 1
    );
    this.lastHighlightedParagraphFlag++;
  }

  decreaseParagraph() {
    this.sortIndexesToHighlight();
    this.indexesToHighlightAsParagraph =
      this.indexesToHighlightAsParagraph.sort();
    this.indexesToHighlightAsParagraph.pop();
    this.lastHighlightedParagraphFlag--;
  }

  increaseTitleAndDecreaseParagraph() {
    this.sortIndexesToHighlight();
    this.indexesToHighlightAsTitle.push(this.indexesToHighlightAsParagraph[0]);

    this.indexesToHighlightAsParagraph.shift();
    this.lastHighlightedTitleFlag++;
    this.lastHighlightedParagraphFlag--;
  }

  decreaseTitleAndIncreaseParagraph() {
    this.sortIndexesToHighlight();
    this.indexesToHighlightAsParagraph.push(
      this.indexesToHighlightAsTitle[this.indexesToHighlightAsTitle.length - 1]
    );
    this.indexesToHighlightAsTitle.pop();
    this.lastHighlightedTitleFlag--;
    this.lastHighlightedParagraphFlag++;
  }

  resetHighlightVariables() {
    this.indexesToHighlightAsTitle = [];
    this.indexesToHighlightAsParagraph = [];
    this.lastHighlightedTitleFlag = 0;
    this.lastHighlightedParagraphFlag = 10;
  }

  sortIndexesToHighlight() {
    this.indexesToHighlightAsTitle = this.indexesToHighlightAsTitle.sort();
    this.indexesToHighlightAsParagraph =
      this.indexesToHighlightAsParagraph.sort();
  }

  highlightText() {
    this.resetAllHighlights();
    for (let i = 0; i < this.indexesToHighlightAsTitle.length; i++) {
      this.textAsArray[this.indexesToHighlightAsTitle[i]].followingHighlight =
        false;
      this.textAsArray[this.indexesToHighlightAsTitle[i]].foudHighlight = true;
    }
    console.log('TITLES');
    console.log(this.indexesToHighlightAsTitle);
    console.log('PARAGRAPHS');
    console.log(this.indexesToHighlightAsParagraph);

    for (let i = 0; i < this.indexesToHighlightAsParagraph.length; i++) {
      this.textAsArray[
        this.indexesToHighlightAsParagraph[i]
      ].followingHighlight = true;
    }
  }

  resetAllHighlights() {
    for (let i = 0; i < this.textAsArray.length; i++) {
      this.textAsArray[i].foudHighlight = false;
      this.textAsArray[i].followingHighlight = false;
    }
  }

  resetAllHighlithingVariables() {
    this.indexesToHighlightAsTitle = [];
    this.indexesToHighlightAsParagraph = [];
    this.lastHighlightedTitleFlag = 0;
    this.lastHighlightedParagraphFlag = 10;
    this.numberOfLinesToAddToTitle = 0;
    this.numberOfFollowingLines = 10;
  }

  resetSelections() {
    this.resetAllHighlithingVariables();
    this.resetAllHighlights();
  }

  onBlockSelectedNumericEvent() {
    const documentSectionAsNumeric: DocumentSectionNumeric = {
      titles: this.indexesToHighlightAsTitle,
      paragraph: this.indexesToHighlightAsParagraph,
    };
    console.log(documentSectionAsNumeric);
    this.textSelectEventAsNumeric.emit(documentSectionAsNumeric);
  }

  // ------------------------- SELECTION HANDLING -------------------------
  public hostRectangle: SelectionRectangle | null;

  private selectedText: string;

  // ---
  // PUBLIC METHODS.
  // ---

  // I render the rectangles emitted by the [textSelect] directive.
  public renderRectangles(event: TextSelectEvent): void {
    console.group('Text Select Event');
    console.log('Text:', event.text);
    this.highlitedText = event.text;
    this.textSelectEvent.emit(this.highlitedText);
    console.log('Viewport Rectangle:', event.viewportRectangle);
    console.log('Host Rectangle:', event.hostRectangle);
    console.groupEnd();

    // If a new selection has been created, the viewport and host rectangles will
    // exist. Or, if a selection is being removed, the rectangles will be null.
    if (event.hostRectangle) {
      this.hostRectangle = event.hostRectangle;
      this.selectedText = event.text;
    } else {
      this.hostRectangle = null;
      this.selectedText = '';
    }
  }

  // I share the selected text with friends :)
  public shareSelection(): void {
    console.group('Shared Text');
    console.log(this.selectedText);
    console.groupEnd();

    // Now that we've shared the text, let's clear the current selection.
    document!.getSelection()!.removeAllRanges();
    // CAUTION: In modern browsers, the above call triggers a "selectionchange"
    // event, which implicitly calls our renderRectangles() callback. However,
    // in IE, the above call doesn't appear to trigger the "selectionchange"
    // event. As such, we need to remove the host rectangle explicitly.
    this.hostRectangle = null;
    this.selectedText = '';
  }
}
