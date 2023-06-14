import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';

import { FileLine } from 'src/app/core/models/file-line.model';
import { H1Section } from 'src/app/core/models/h1section.model';
import { H2Section } from 'src/app/core/models/h2section.model';
import { H3Section } from 'src/app/core/models/h3section.model';

interface SeletectedTags {
  tag: string;
  content: string;
  simpleHighlight?: boolean;
}

interface SavedState {
  contentWithTags: SeletectedTags[];
}

interface ElementHelper {
  element: HTMLElement;
  id: number | string;
}

interface HierarchizeText {
  h1Content: string;
  h2Content?: string;
  h3Content?: string;
  paragraph?: string;
  h1Index: number;
  h2Index?: number;
  h3Index?: number;
  paragraphIndex?: number;
}

interface OrganizedSection {
  h1Sections: H1Section[];
}

@Component({
  selector: 'app-titles-selection',
  templateUrl: './titles-selection.component.html',
  styleUrls: ['./titles-selection.component.scss'],
})
export class TitlesSelectionComponent implements OnInit, OnChanges {
  @ViewChild('selectionZone') selectionZone: ElementRef;

  @Input() fileContent: FileLine[];
  @Input() topicToSearch: string = '';
  @Output() hierarchizeTextEvent: EventEmitter<OrganizedSection> =
    new EventEmitter();

  organizedSection: OrganizedSection;

  savedStates: SavedState[] = [];
  textWithTags: SeletectedTags[] = [];
  hierarquizedText: HierarchizeText[] = [];

  selectedItems: number[] = [];
  foundIndexes: number[] = [];

  fileContentString: string = '';
  highlitedText: string;
  currentTag: string = 'None';
  searchTerm: string = '';

  currentStateIndex: number = 0;
  currentSearchTermIndex: number = -1;
  h1CurrentIndex = -1;
  h2CurrentIndex = -1;
  h3CurrentIndex = -1;
  paragraphCurrentIndex = -1;

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['fileContent'] && changes['fileContent'].currentValue) {
      changes['fileContent'].currentValue.map((line: FileLine) => {
        this.textWithTags.push({ tag: 'None', content: line.content });
      });
    }

    if (
      changes['topicToSearch'] &&
      this.textWithTags &&
      this.textWithTags.length > 0
    ) {
      this.searchTerm = changes['topicToSearch'].currentValue;
      this.changeSearchText();
    }
  }

  onTagSelectionChange(tagChange: string) {
    this.currentTag = tagChange;
  }

  arrayToString(array: string[]) {
    return array.join('\n');
  }

  firstClickElement: ElementHelper;
  lastClickElement: ElementHelper;

  onMouseDown(event: any) {
    const evenTarget = event.target as HTMLElement;
    this.firstClickElement = {
      element: evenTarget,
      id: evenTarget.id.match(/\d+/)?.[0]!,
    };
  }

  onMouseUp(event: any) {
    const evenTarget = event.target as HTMLElement;
    this.lastClickElement = {
      element: evenTarget,
      id: evenTarget.id.match(/\d+/)?.[0]!,
    };

    this.createDocumentElementBeginning();
    this.setLinesTags();
    // Do something with the first and last clicked elements
  }

  setLinesTags() {
    for (
      let i = Number(this.firstClickElement.id);
      i <= Number(this.lastClickElement.id);
      i++
    ) {
      this.textWithTags[i].tag = this.currentTag;
    }
  }

  createDocumentElementBeginning() {
    if (this.firstClickElement.id && this.currentTag !== 'LIXO') {
      this.deleteAnyHelperTagsInRange();
      const selectedElement = document.createElement('span');
      selectedElement.innerText = this.currentTag;
      selectedElement.id = 'helper-tag-' + this.firstClickElement.id;
      selectedElement.className = this.currentTag;

      this.firstClickElement.element.insertAdjacentElement(
        'beforebegin',
        selectedElement
      );
      this.currentStateIndex++;
    }
  }

  deleteAnyHelperTagsInRange() {
    const firstId = Number(this.firstClickElement.id);
    const lastId = Number(this.lastClickElement.id);

    for (let i = Number(firstId); i <= Number(lastId); i++) {
      document.getElementById('helper-tag-' + i)?.remove();
    }
  }

  createDocumentRange(startNode: HTMLElement, endNode: HTMLElement) {
    const range = document.createRange();
    range.setStartBefore(startNode);
    range.setEndAfter(endNode);
    return range;
  }

  findIndexesOfSearchTerm() {
    this.findIndexesWhereSearchTermIsFound(this.searchTerm.toLowerCase());
    if (this.foundIndexes.length > 0) {
      this.currentSearchTermIndex = 0;
    }
  }

  findIndexesWhereSearchTermIsFound(searchText: string) {
    this.foundIndexes = [];
    for (let i = 0; i < this.textWithTags.length; i++) {
      if (this.textWithTags[i].content.toLowerCase().includes(searchText)) {
        this.foundIndexes.push(i);
      }
    }
  }

  scrollToFoundValue(index: number) {
    if (this.foundIndexes.length > 0) {
      const element = this.selectionZone.nativeElement.querySelector(
        `#content-${this.foundIndexes[index]}`
      );
      const topPos = element.offsetTop - 150;
      this.textWithTags[this.foundIndexes[index]].simpleHighlight = true;

      if (element) {
        this.selectionZone.nativeElement.scrollTop = topPos;
        //element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
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

  changeSearchText() {
    this.findIndexesOfSearchTerm();

    if (this.foundIndexes.length > 0) {
      this.scrollToFoundValue(0);
    }
  }

  // ------------------------------------------
  numberOfH1 = 0;
  numberOfH2 = 0;
  numberOfH3 = 0;
  numberOfP = 0;
  h1Sections: H1Section[] = [];
  h2Sections: H2Section[] = [];
  h3Sections: H3Section[] = [];

  lastTagInserted = 'None';

  hierarchizeText() {
    this.h1Sections = [];
    const parsedArray = this.textWithTags.filter((item) => item.content !== '');
    parsedArray.forEach((item, index) => {
      if (parsedArray[index].tag === 'H1') {
        this.resetH2Helpers();
        this.resetH3Helpers();
        this.h1HeadersManager(parsedArray, index);
        this.lastTagInserted = 'H1';
      }
      if (parsedArray[index].tag === 'H2') {
        this.resetH3Helpers();
        this.h2HeadersManager(parsedArray, index);
        this.lastTagInserted = 'H2';
      }
      if (parsedArray[index].tag === 'H3') {
        this.h3HeadersManager(parsedArray, index);
        this.lastTagInserted = 'H3';
      }
      if (parsedArray[index].tag === 'P') {
        this.paragraphManager(parsedArray, index);
      }
    });

    this.organizedSection = {
      h1Sections: this.h1Sections,
    };
    this.hierarchizeTextEvent.emit(this.organizedSection);
    console.log(this.organizedSection);
  }

  h1HeadersManager(parsedArray: SeletectedTags[], index: number) {
    //When it is 0, it means that it is a continuation of the last H1. If not, it is a new H1
    const decidedIndex = this.decideTagIndex(parsedArray, index);
    const previosNumberOfH1 = this.numberOfH1;
    this.numberOfH1 += decidedIndex;
    const h1Content = parsedArray[index].content;

    this.addToH1Sections(h1Content, previosNumberOfH1, this.numberOfH1);
  }

  h2HeadersManager(parsedArray: SeletectedTags[], index: number) {
    const decidedIndex = this.decideTagIndex(parsedArray, index);
    const previosNumberOfH2 = this.numberOfH2;
    this.numberOfH2 += decidedIndex;
    const h2Content = parsedArray[index].content;

    this.addH2ToH1Section(
      this.h1Sections.length - 1,
      h2Content,
      previosNumberOfH2,
      this.numberOfH2
    );
  }

  h3HeadersManager(parsedArray: SeletectedTags[], index: number) {
    const decidedIndex = this.decideTagIndex(parsedArray, index);
    const previosNumberOfH3 = this.numberOfH3;
    this.numberOfH3 += decidedIndex;
    const h3Content = parsedArray[index].content;

    this.addH3ToH2Section(
      this.h1Sections.length - 1,
      this.h1Sections[this.h1Sections.length - 1].h2Sections.length - 1,
      h3Content,
      previosNumberOfH3,
      this.numberOfH3
    );
  }

  paragraphManager(parsedArray: SeletectedTags[], index: number) {
    const decidedIndex = this.decideTagIndex(parsedArray, index);
    this.numberOfP += decidedIndex;
    const pContent = parsedArray[index].content;

    this.addParagraphsToSections(pContent, index, this.lastTagInserted);
  }

  addParagraphsToSections(
    content: string,
    index: number,
    lastTagInserted: string
  ) {
    if (lastTagInserted === 'H1') {
      this.h1Sections[this.h1Sections.length - 1].paragraphsSections?.push(
        content
      );
    }
    if (lastTagInserted === 'H2') {
      const currentH1Index = this.h1Sections.length - 1;
      const currentH2Index =
        this.h1Sections[currentH1Index].h2Sections.length - 1;

      this.h1Sections[this.h1Sections.length - 1].h2Sections[
        currentH2Index
      ].paragraphsSections.push(content);
    }
    if (lastTagInserted === 'H3') {
      const currentH1Index = this.h1Sections.length - 1;
      const currentH2Index =
        this.h1Sections[currentH1Index].h2Sections.length - 1;
      const currentH3Index =
        this.h1Sections[currentH1Index].h2Sections[currentH2Index].h3Sections
          .length - 1;

      this.h1Sections[this.h1Sections.length - 1].h2Sections[
        currentH2Index
      ].h3Sections[currentH3Index].paragraphsSections.push(content);
    }
  }

  addToH1Sections(
    h1Content: string,
    previosNumberOfH1: number,
    numberOfH1: number
  ) {
    if (previosNumberOfH1 == numberOfH1) {
      this.h1Sections[this.h1Sections.length - 1].h1Content += ' ' + h1Content;
    } else {
      this.h1Sections.push({
        h1Content: h1Content,
        h2Sections: [],
        paragraphsSections: [],
      });
    }
  }

  resetH2Helpers() {
    this.h2Sections = [];
    this.numberOfH2 = 0;
  }

  addH2ToH1Section(
    h1SectionIndex: number,
    h2Content: string,
    previosNumberOfH2: number,
    numberOfH2: number
  ) {
    if (previosNumberOfH2 == numberOfH2) {
      this.h2Sections[this.h2Sections.length - 1].h2Content += ' ' + h2Content;
    } else {
      this.h2Sections.push({
        h2Content: h2Content,
        paragraphsSections: [],
        h3Sections: [],
      });
    }
    this.h1Sections[h1SectionIndex].h2Sections = this.h2Sections;
  }

  resetH3Helpers() {
    this.h3Sections = [];
    this.numberOfH3 = 0;
  }

  addH3ToH2Section(
    h1SectionIndex: number,
    h2SectionIndex: number,
    h3Content: string,
    previosNumberOfH3: number,
    numberOfH3: number
  ) {
    if (previosNumberOfH3 == numberOfH3) {
      this.h3Sections[this.h3Sections.length - 1].h3Content += ' ' + h3Content;
    } else {
      this.h3Sections.push({
        h3Content: h3Content,
        paragraphsSections: [],
      });
    }
    this.h1Sections[h1SectionIndex].h2Sections[h2SectionIndex].h3Sections =
      this.h3Sections;
  }

  resetAllHelpers() {
    this.resetH2Helpers();
    this.resetH3Helpers();
  }

  decideTagIndex(parsedArray: SeletectedTags[], index: number): number {
    const currentElement = parsedArray[index];
    const previousElement = index > 0 ? parsedArray[index - 1] : null;
    if (previousElement && previousElement.tag == currentElement.tag) {
      console.log(previousElement);
      console.log(currentElement);
      return 0;
    }
    return 1;
  }
}
