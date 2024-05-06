import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent, CalendarDialogComponent } from './index/index.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CompilanceRoutes } from './compilance.routing';
import { RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NotificationComponent } from './index/notification/notification.component';
import { NotificationService } from './index/notification.service';
import { RegisterComponent } from './register/register.component';
import { ConfigModule } from '../config/config.module';
import { DisplayModalComponent } from './register/display-modal/display-modal.component';
import { SearchTopicComponent } from 'src/app/shared/components/search-topic/search-topic.component';
import { RegisterClientComponent } from './register-client/register-client.component';
import { DetailDayComponent } from './register-client/detail-day/detail-day.component';
import { DetailCumplimientoComponent } from './register-client/detail-cumplimiento/detail-cumplimiento.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainModule } from '../main/main.module';
import { CustomTooltipComponent } from './register-client/custom-tooltip/custom-tooltip.component';
import { ModalCalendarDayComponent } from './index/modal-calendar-day/modal-calendar-day.component';
import { ModalDataService } from './index/modal-data.service';
import { MousePositionService } from './index/mouse-position.service';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { EditVideoComponent } from './register/edit-video/edit-video.component';



@NgModule({
  declarations: [
    IndexComponent,
    CalendarDialogComponent,
    NotificationComponent,
    RegisterComponent,
    DisplayModalComponent,
    SearchTopicComponent,
    RegisterClientComponent,
    DetailDayComponent,
    DetailCumplimientoComponent,
    CustomTooltipComponent,
    ModalCalendarDayComponent,
    EditVideoComponent,
  ],
  imports: [
    CommonModule,
    MainModule,
    DemoMaterialModule,
    AutocompleteLibModule,
    RouterModule.forChild(CompilanceRoutes),
    CalendarModule.forRoot({
      provide:DateAdapter,
      useFactory:adapterFactory
    }),
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ConfigModule,
    SharedModule,
    NgxMatDatetimePickerModule,
    ],
  providers:[NotificationService, ModalDataService, MousePositionService]
})
export class ComplianceModule { }
