import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCompanyComponent } from './my-company/my-company.component';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { SharedModule } from 'src/app/shared/shared.module';
import { MainModule } from '../main/main.module';
import { RouterModule } from '@angular/router';
import { WarningRoutes } from './warning.routing';



@NgModule({
  declarations: [
    MyCompanyComponent
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    SharedModule,
    //MainModule,
    RouterModule.forChild(WarningRoutes),
  ]
})
export class WarningModule { }
