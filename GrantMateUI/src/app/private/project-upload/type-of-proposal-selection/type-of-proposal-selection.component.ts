import { Component, EventEmitter, Output } from '@angular/core';
import { PROPOSAL_SECTIONS } from 'src/app/core/constants/proposal-sections.constants';
import { TypeOfProposals } from 'src/app/core/models/type-of-proposals.model';

@Component({
  selector: 'app-type-of-proposal-selection',
  templateUrl: './type-of-proposal-selection.component.html',
  styleUrls: ['./type-of-proposal-selection.component.scss'],
})
export class TypeOfProposalSelectionComponent {
  @Output() typeOfProposalChange: EventEmitter<string> = new EventEmitter();
  @Output() sectionChange: EventEmitter<string> = new EventEmitter();

  horizonEuropeSections = PROPOSAL_SECTIONS.HORIZON_EUROPE_SECTION;
  eurostarsSections = PROPOSAL_SECTIONS.EUROSTARS_SECTION;
  sections: string[];

  selectedTypeOfProposal: string;
  selectedSection: string = '';

  typeOfProposals: TypeOfProposals[] = [
    { value: 'Eurostars', viewValue: 'Eurostars' },
    { value: 'Horizon', viewValue: 'Horizon' },
  ];

  onTypeOfProposalSelectionChange(typeOfProposal: string) {
    this.typeOfProposalChange.emit(typeOfProposal);
    if (typeOfProposal == 'Eurostars') {
      this.sections = this.eurostarsSections;
    } else {
      this.sections = this.horizonEuropeSections;
    }
  }

  onSectionChange() {
    if (this.selectedSection) this.sectionChange.emit(this.selectedSection);
  }
}
