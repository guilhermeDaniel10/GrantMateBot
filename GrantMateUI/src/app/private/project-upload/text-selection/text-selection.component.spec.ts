import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextSelectionComponent } from './text-selection.component';

describe('TextSelectionComponent', () => {
  let component: TextSelectionComponent;
  let fixture: ComponentFixture<TextSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextSelectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
