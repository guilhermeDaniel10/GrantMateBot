import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenFieldConfigComponent } from './open-field-config.component';

describe('OpenFieldConfigComponent', () => {
  let component: OpenFieldConfigComponent;
  let fixture: ComponentFixture<OpenFieldConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenFieldConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenFieldConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
