import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceOutputConfigComponent } from './service-output-config.component';

describe('ServiceOutputConfigComponent', () => {
  let component: ServiceOutputConfigComponent;
  let fixture: ComponentFixture<ServiceOutputConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceOutputConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceOutputConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
