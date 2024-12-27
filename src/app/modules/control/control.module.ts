import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapacitationsComponent } from './capacitations/capacitations.component';
import { EndedVideoComponent } from './videos/videos.component';
import { VideosComponent } from './videos/videos.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import {VgStreamingModule} from '@videogular/ngx-videogular/streaming';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlRoutes } from './control.routing';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { DatePipe } from '@angular/common';
import { QuestionarieComponent } from './capacitations/questionarie/questionarie.component';
import { MainModule } from '../main/main.module';
import { ChatComponent } from './chat/chat.component';
import { PdfViewerModalComponent } from './chat/pdf-viewer-modal/pdf-viewer-modal.component';
import { ResultsComponent } from './results/results.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { QuestionnaireHistoryComponent } from './questionnaire-history/questionnaire-history.component';

registerLocaleData(localeEs);

@NgModule({
  declarations: [
    CapacitationsComponent,
    EndedVideoComponent,
    VideosComponent,
    QuestionarieComponent,
    ChatComponent,
    PdfViewerModalComponent,
    ResultsComponent,
    QuestionnaireHistoryComponent,
  ],
  providers: [DatePipe, CapacitationsComponent, {provide: LOCALE_ID, useValue: 'es'}],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(ControlRoutes),
    DemoMaterialModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    MainModule,
    SharedModule
  ]
})
export class ControlModule { }
