import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotMessageComponent } from './chat-bot-message.component';

describe('ChatBotMessageComponent', () => {
  let component: ChatBotMessageComponent;
  let fixture: ComponentFixture<ChatBotMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBotMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatBotMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
