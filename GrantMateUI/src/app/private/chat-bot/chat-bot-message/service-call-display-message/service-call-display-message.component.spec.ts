import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceCallDisplayMessageComponent } from './service-call-display-message.component';

describe('ServiceCallDisplayMessageComponent', () => {
  let component: ServiceCallDisplayMessageComponent;
  let fixture: ComponentFixture<ServiceCallDisplayMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceCallDisplayMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceCallDisplayMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
