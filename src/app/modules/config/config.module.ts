import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { ConfigRoutes } from './config.routing';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AddUserDialogComponent } from './users/add-user-dialog/add-user-dialog.component';
import { RemoveUserDialogComponent } from './users/remove-user-dialog/remove-user-dialog.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
import { EditUserDialogComponent } from './users/edit-user-dialog/edit-user-dialog.component';


@NgModule({
  declarations: [
    UsersComponent,
    AddUserDialogComponent,
    EditUserDialogComponent,
    RemoveUserDialogComponent,
    MenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ConfigRoutes),
    DemoMaterialModule,
    FormsModule
  ]
})
export class ConfigModule { }
