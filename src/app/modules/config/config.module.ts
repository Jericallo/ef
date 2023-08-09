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
import { ProfilesComponent } from './profiles/profiles.component';
import { DatePipe } from '@angular/common';
import { RemoveProfileDialogComponent } from './profiles/remove-profile-dialog/remove-profile-dialog.component';
import { AddProfileDialogComponent } from './profiles/add-profile-dialog/add-profile-dialog.component';
import { EditProfileDialogComponent } from './profiles/edit-profile-dialog/edit-profile-dialog.component';
import { ModulesComponent } from './modules/modules.component';



@NgModule({
  declarations: [
    UsersComponent,
    AddUserDialogComponent,
    EditUserDialogComponent,
    RemoveUserDialogComponent,
    MenuComponent,
    ProfilesComponent,
    RemoveProfileDialogComponent,
    AddProfileDialogComponent,
    EditProfileDialogComponent,
    ModulesComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(ConfigRoutes),
    DemoMaterialModule,
    FormsModule
  ]
})
export class ConfigModule { }
