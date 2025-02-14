import { LOCALE_ID, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { IntroComponent } from './intro/intro.component';
import { NewsComponent } from './news/news.component';
import { MainRoutes } from './main.routing';
import { CalendarFormDialogComponent } from '../compliance/index/calendar-form-dialog/calendar-form-dialog.component';
import { AlertTemplate } from '../compliance/index/calendar-form-dialog/calendar-form-dialog.component';
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
import { ResponseComponent } from './response/response.component';

import { MatTreeModule } from '@angular/material/tree';

import { VideoIntroComponent } from './video-intro/video-intro.component';
import { CountdownModalComponent } from './intro/countdown-modal/countdown-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MyCompanyComponent } from './my-company/my-company.component';
import { ComplianceOpinionHistoryComponent } from './my-company/compliance-opinion-history/compliance-opinion-history.component';
import { ComplianceNotificationsComponent } from './my-company/compliance-notifications/compliance-notifications.component';
import { ComplianceTaxReturnComponent } from './my-company/compliance-tax-return/compliance-tax-return.component';
import { UpdateEsignComponent } from './my-company/update-esign/update-esign.component';
import { ComplianceKeysHistoryComponent } from './my-company/compliance-keys-history/compliance-keys-history.component';


@NgModule({
  declarations: [
    IntroComponent,
    NewsComponent,
    CalendarFormDialogComponent,
    AlertTemplate,
    LawsComponent,
    UserIconComponent,
    TopicsComponent,
    CourseDetailComponent,
    SearchComponent,
    ResponseComponent,
    VideoIntroComponent,
    CountdownModalComponent,
    MyCompanyComponent,
    ComplianceOpinionHistoryComponent,
    ComplianceNotificationsComponent,
    ComplianceTaxReturnComponent,
    UpdateEsignComponent,
    ComplianceKeysHistoryComponent,
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
    CdkTreeModule,
    MatTreeModule,
    SharedModule
  ],
  providers:[CourseService, {provide:LOCALE_ID, useValue:'es'}],
  exports:[UserIconComponent]
})
export class MainModule { }
