import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectUploadComponent } from './private/project-upload/project-upload.component';
import { ProjectUploadService } from './private/project-upload/project-upload.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TextSelectionComponent } from './private/project-upload/text-selection/text-selection.component';
import { TextSelectEventDirective } from './private/project-upload/text-selection/text-select-event.directive';
import { MatCardModule } from '@angular/material/card';
import { FileUploadComponent } from './shared/file-upload/file-upload.component';
import { MatIconModule } from '@angular/material/icon';
import { HighlighterPipe } from './pipes/highlighter.pipe';
import { HighlightDirectiveDirective } from './core/directives/highlight-directive.directive';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TypeOfProposalSelectionComponent } from './private/project-upload/type-of-proposal-selection/type-of-proposal-selection.component';
import { DocumentViewComponent } from './private/project-upload/document-section-view/document-section-view.component';
import { SavedSectionComponent } from './private/project-upload/saved-section/saved-section.component';
import { HighlightSearchPipe } from './pipes/highlight-search.pipe';
import { MatTableModule } from '@angular/material/table';
import { ChatBotComponent } from './private/chat-bot/chat-bot.component';
import { HighlightNextWordsPipe } from './pipes/highlight-next-words.pipe';
import { TitlesSelectionComponent } from './private/project-upload/titles-selection/titles-selection.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TypeOfTextDropdownComponent } from './private/project-upload/titles-selection/type-of-text-dropdown/type-of-text-dropdown.component';
import { TagRadioSelectionComponent } from './private/project-upload/titles-selection/tag-radio-selection/tag-radio-selection.component';
import { MatRadioModule } from '@angular/material/radio';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from './private/pdf-viewer/pdf-viewer.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MainPageComponent } from './private/main-page/main-page.component';
import { NavBarComponent } from './private/main-page/nav-bar/nav-bar.component';
import { ConversationHistoryComponent } from './private/conversation-history/conversation-history.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SideNavComponent } from './private/main-page/side-nav/side-nav.component';
import { ScrollToBottomDirective } from './private/main-page/scroll-to-bottom.directive';
import { ChatBotMessageComponent } from './private/chat-bot/chat-bot-message/chat-bot-message.component';
import { DropdownConfigComponent } from './private/chat-bot/chat-bot-message/dropdown-config/dropdown-config.component';
import { OpenFieldConfigComponent } from './private/chat-bot/chat-bot-message/open-field-config/open-field-config.component';
import { CustomHttpInterceptor } from './core/interceptor/http.interceptor';
import { ServiceOutputConfigComponent } from './private/chat-bot/chat-bot-message/service-output-config/service-output-config.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ServiceCallDisplayMessageComponent } from './private/chat-bot/chat-bot-message/service-call-display-message/service-call-display-message.component';
import { CustomMessageConfigComponent } from './private/chat-bot/chat-bot-message/custom-message-config/custom-message-config.component';


@NgModule({
  declarations: [
    AppComponent,
    ProjectUploadComponent,
    TextSelectionComponent,
    TextSelectEventDirective,
    FileUploadComponent,
    HighlighterPipe,
    HighlightDirectiveDirective,
    TypeOfProposalSelectionComponent,
    DocumentViewComponent,
    SavedSectionComponent,
    HighlightSearchPipe,
    ChatBotComponent,
    HighlightNextWordsPipe,
    TitlesSelectionComponent,
    TypeOfTextDropdownComponent,
    TagRadioSelectionComponent,
    PdfViewerComponent,
    MainPageComponent,
    NavBarComponent,
    ConversationHistoryComponent,
    SideNavComponent,
    ScrollToBottomDirective,
    ChatBotMessageComponent,
    DropdownConfigComponent,
    OpenFieldConfigComponent,
    ServiceOutputConfigComponent,
    ServiceCallDisplayMessageComponent,
    CustomMessageConfigComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    HttpClientModule,
    FormsModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatCardModule,
    ScrollingModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgbModule,
    MatRadioModule,
    PdfViewerModule,
    MatTabsModule,
    MatSidenavModule,
    MatCheckboxModule
  ],
  providers: [
    ProjectUploadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  exports: [
    TextSelectEventDirective,
    HighlighterPipe,
    HighlightDirectiveDirective,
    HighlightNextWordsPipe,
    ScrollToBottomDirective,
  ],
})
export class AppModule {}
