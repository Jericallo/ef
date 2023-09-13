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

@NgModule({
  declarations: [
    CapacitationsComponent,
    EndedVideoComponent,
    VideosComponent,
  ],
  providers: [DatePipe, CapacitationsComponent],
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
    VgStreamingModule

  ]
})
export class ControlModule { }
