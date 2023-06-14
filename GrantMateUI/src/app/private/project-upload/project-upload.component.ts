import { Component, OnInit } from '@angular/core';
import { ProjectUploadService } from './project-upload.service';
import { Subscription } from 'rxjs';
import { TypeOfProposals } from 'src/app/core/models/type-of-proposals.model';
import { PROPOSAL_SECTIONS } from 'src/app/core/constants/proposal-sections.constants';
import { HighlightSection } from 'src/app/core/models/section-highlight.model';
import { DocumentSection } from 'src/app/core/models/document-section.model';
import { SelectedValues } from 'src/app/core/models/selected-values.model';
import { FileLine } from 'src/app/core/models/file-line.model';
import { DocumentSectionNumeric } from 'src/app/core/models/document-section-numeric.model';
import { OrganizedSection } from 'src/app/core/models/organized-section.model';
@Component({
  selector: 'app-project-upload',
  templateUrl: './project-upload.component.html',
  styleUrls: ['./project-upload.component.scss'],
})
export class ProjectUploadComponent implements OnInit {
  horizonEuropeSections = PROPOSAL_SECTIONS.HORIZON_EUROPE_SECTION;
  eurostarsSections = PROPOSAL_SECTIONS.EUROSTARS_SECTION;
  sections: string[];

  selectedSection: string = '';

  typeOfProposals: TypeOfProposals[] = [
    { value: 'Eurostars', viewValue: 'Eurostars' },
    { value: 'Horizon', viewValue: 'Horizon' },
  ];

  textToShow: FileLine[];
  textAsString: string;
  selectedTypeOfProposal: string;
  highlightedSection: HighlightSection = {
    selectedSection: '',
    selectedTypeOfProposal: '',
    selectedText: '',
  };

  sectionToSubmit: HighlightSection = {
    selectedSection: '',
    selectedTypeOfProposal: '',
    selectedText: '',
  };

  subscription: Subscription;

  savedValue: DocumentSection;
  savedDocumentSections: DocumentSection[] = [];

  constructor(public projectUploadService: ProjectUploadService) {}

  ngOnInit(): void {
    console.log('hre');
    this.getSavedSections();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onTypeOfProposalSelectionChange(typeOfProposal: string) {
    if (typeOfProposal == 'Eurostars') {
      this.sections = this.eurostarsSections;
    } else {
      this.sections = this.horizonEuropeSections;
    }
  }

  onSubmitSection(documentSection: DocumentSection) {
    this.subscription = this.projectUploadService
      .createDocumentSectionLine(documentSection)
      .subscribe((data) => {
        this.savedValue = {
          heading: data.heading,
          paragraph: data.paragraph,
        };
        this.savedDocumentSections.push(this.savedValue);
      });
  }

  getSavedSections() {
    this.subscription = this.projectUploadService
      .getSavedSections()
      .subscribe((data) => {
        this.savedDocumentSections = data;
        console.log(data);
      });
  }

  onTextSelect(event: MouseEvent) {
    const selection = window.getSelection();
    console.log(selection);
  }

  onTypeOfProposalsChange(typeOfProposal: string) {
    this.selectedTypeOfProposal = typeOfProposal;
  }

  onSectionChange(section: string) {
    if (section) {
      this.highlightedSection = {
        selectedSection: section,
        selectedTypeOfProposal: this.selectedTypeOfProposal,
        selectedText: '',
      };
    }
  }

  onFileUpload(fileAsTxt: string[]) {
    //this.textToShow = fileAsTxt;
    this.textToShow = fileAsTxt.map((str) => ({
      content: str,
      foudHighlight: false,
      followingHighlight: false,
    }));
    this.textAsString = fileAsTxt.join('<br>');
  }

  highlightedText(selectedText: string) {
    this.highlightedSection.selectedText = selectedText;
  }

  highlightedTextAsNumeric(selectedDocumentLines: DocumentSectionNumeric) {
    const selectedHeadings = selectedDocumentLines.titles.map(
      (i) => this.textToShow[i]
    );
    const selectedParagraps = selectedDocumentLines.paragraph.map(
      (i) => this.textToShow[i]
    );

    const selectedHeadingAsString = selectedHeadings
      .map((h) => h.content)
      .join(' ');

    const selecetedParagraphAsString = selectedParagraps
      .map((p) => p.content)
      .join(' ');

    this.sectionToSubmit = {
      selectedSection: selectedHeadingAsString,
      selectedText: selecetedParagraphAsString,
      selectedTypeOfProposal: this.selectedTypeOfProposal,
    };

    console.log(this.sectionToSubmit);
  }

  onHierarchizeText(hierarchizedText: OrganizedSection) {
    hierarchizedText = this.addProposalTypeToHierarchy(
      hierarchizedText,
      this.selectedTypeOfProposal
    );
    this.projectUploadService
      .uploadHierarchySections(hierarchizedText)
      .subscribe((data) => {
        console.log(data);
      });
  }

  addProposalTypeToHierarchy(
    hierarchizedText: OrganizedSection,
    proposalType: string
  ) {
    hierarchizedText.h1Sections.forEach((h1) => {
      h1.h1Content = `${proposalType} ${h1.h1Content}`;
    });
    return hierarchizedText;
  }
}
