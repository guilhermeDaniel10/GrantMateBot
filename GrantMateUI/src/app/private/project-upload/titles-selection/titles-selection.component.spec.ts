import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitlesSelectionComponent } from './titles-selection.component';

describe('TitlesSelectionComponent', () => {
  let component: TitlesSelectionComponent;
  let fixture: ComponentFixture<TitlesSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TitlesSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitlesSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
