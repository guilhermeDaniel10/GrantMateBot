import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMessageConfigComponent } from './custom-message-config.component';

describe('CustomMessageConfigComponent', () => {
  let component: CustomMessageConfigComponent;
  let fixture: ComponentFixture<CustomMessageConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMessageConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomMessageConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
