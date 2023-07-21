import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { ConfigRoutes } from './config.routing';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ConfigRoutes)
  ]
})
export class ConfigModule { }
