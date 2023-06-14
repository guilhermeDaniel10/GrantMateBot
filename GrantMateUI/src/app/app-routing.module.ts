import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './private/main-page/main-page.component';
import { ProjectUploadComponent } from './private/project-upload/project-upload.component';
import { ChatBotResolver } from './private/chat-bot/chat-bot.resolver';

const routes: Routes = [
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  {
    path: 'chat',
    component: MainPageComponent
  },
  {
    path: 'proposal-extraction',
    component: ProjectUploadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
