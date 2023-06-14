import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedSectionComponent } from './saved-section.component';

describe('SavedSectionComponent', () => {
  let component: SavedSectionComponent;
  let fixture: ComponentFixture<SavedSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
