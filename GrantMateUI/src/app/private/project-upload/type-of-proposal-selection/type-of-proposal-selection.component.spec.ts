import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfProposalSelectionComponent } from './type-of-proposal-selection.component';

describe('TypeOfProposalSelectionComponent', () => {
  let component: TypeOfProposalSelectionComponent;
  let fixture: ComponentFixture<TypeOfProposalSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfProposalSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfProposalSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
