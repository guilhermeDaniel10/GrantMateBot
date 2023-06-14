import { TestBed } from '@angular/core/testing';

import { ChatBotResolver } from './chat-bot.resolver';

describe('ChatBotResolver', () => {
  let resolver: ChatBotResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ChatBotResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
