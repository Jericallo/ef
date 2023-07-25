import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IntroComponent } from './intro/intro.component';
import { NewsComponent } from './news/news.component';
import { MainRoutes } from './main.routing';
import { IndexComponent } from './index/index.component';
import { CalendarFormDialogComponent } from './index/calendar-form-dialog/calendar-form-dialog.component';
import { AlertTemplate } from './index/calendar-form-dialog/calendar-form-dialog.component';
import { UserIconComponent } from 'src/app/layouts/full/user-icon/user-icon.component';

import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { CdkTreeModule } from '@angular/cdk/tree';

import { FlexLayoutModule } from '@angular/flex-layout';
import { LawsComponent } from './laws/laws.component';
import { TopicsComponent } from './topics/topics.component';
import { CourseDetailComponent } from './topics/course-detail/course-detail.component';

import {CourseService} from './topics/course.service';
import { SearchComponent } from './search/search.component';

import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { ResponseComponent } from './response/response.component'


@NgModule({
  declarations: [
    IntroComponent,
    NewsComponent,
    IndexComponent,
    CalendarFormDialogComponent,
    AlertTemplate,
    LawsComponent,
    UserIconComponent,
    TopicsComponent,
    CourseDetailComponent,
    SearchComponent,
    ResponseComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    AutocompleteLibModule,
    RouterModule.forChild(MainRoutes),
    CalendarModule.forRoot({
      provide:DateAdapter,
      useFactory:adapterFactory
    }),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    CdkTreeModule
  ],
  providers:[CourseService]
})
export class MainModule { }
