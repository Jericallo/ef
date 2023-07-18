import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticationRoutes } from './authentication.routing';
import { RouterModule } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';
import { LoginComponent } from './login/login.component';
import { PasswordModalComponent } from './login/password-modal/password-modal.component';
import { ResetComponent } from './login/reset/reset.component';
import { DemoMaterialModule } from '../demo-material-module';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  declarations: [
    LogoutComponent,
    LoginComponent,
    PasswordModalComponent,
    ResetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forRoot(AuthenticationRoutes),
    DemoMaterialModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class AuthenticationModule { }
