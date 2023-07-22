import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { ConfigRoutes } from './config.routing';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { RemoveUserDialogComponent } from './remove-user-dialog/remove-user-dialog.component';


@NgModule({
  declarations: [
    UsersComponent,
    AddUserDialogComponent,
    RemoveUserDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ConfigRoutes),
    DemoMaterialModule
  ]
})
export class ConfigModule { }
