import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { ChatBotService } from './chat-bot.service';
import { OutputMessageModel } from './model/output-message.model';

@Injectable({
  providedIn: 'root',
})
export class ChatBotResolver implements Resolve<OutputMessageModel> {
  constructor(private chatBotService: ChatBotService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<OutputMessageModel> {
    return this.chatBotService.getFirstMessage();
  }
}
