import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagRadioSelectionComponent } from './tag-radio-selection.component';

describe('TagRadioSelectionComponent', () => {
  let component: TagRadioSelectionComponent;
  let fixture: ComponentFixture<TagRadioSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagRadioSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagRadioSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
