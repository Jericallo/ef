import { Routes } from '@angular/router';
import { LogoutComponent } from './logout/logout.component';

import { FullComponent } from '../layouts/full/full.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../auth.guard';

export const AuthenticationRoutes: Routes = [
    {
        path: 'logout',
        component:LogoutComponent
        /*component: FullComponent,
        canActivate: [AuthGuard],*/
        /*children: [
            {
                path: '',
                redirectTo: '/login',
                pathMatch: 'full'
            },
            {
                path: 'material',
                loadChildren: () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
            },
            {
                path: 'starter',
                loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
            },
            {
                path: 'main',
                loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule)
            },
            {
                path:'compliance',
                loadChildren: () => import('./modules/compliance/compliance.module').then(m => m.ComplianceModule)
            },
            {
                path:'control',
                loadChildren: () => import('./modules/control/control.module').then(m => m.ControlModule)
            },
            {
                path:'warning',
                loadChildren: () => import('./modules/warning/warning.module').then(m => m.WarningModule)
            }

        ]*/
    },
    {
        path: 'login',
        component: LoginComponent,
    }
];
