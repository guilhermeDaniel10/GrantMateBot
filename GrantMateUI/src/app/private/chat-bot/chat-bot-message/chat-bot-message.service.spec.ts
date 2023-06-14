import { TestBed } from '@angular/core/testing';

import { ChatBotMessageService } from './chat-bot-message.service';

describe('ChatBotMessageService', () => {
  let service: ChatBotMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatBotMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
