import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfTextDropdownComponent } from './type-of-text-dropdown.component';

describe('TypeOfTextDropdownComponent', () => {
  let component: TypeOfTextDropdownComponent;
  let fixture: ComponentFixture<TypeOfTextDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfTextDropdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfTextDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
