import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './authentication/login/login.component';
import { AuthGuard } from './auth.guard';
import { ResetComponent } from './authentication/login/reset/reset.component';
import { LogoutComponent } from './authentication/logout/logout.component';

export const AppRoutes: Routes = [
    {
        path: '',
        component: FullComponent,
        canActivate: [AuthGuard],
        children: [
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
            },
            {
                path:'config',
                loadChildren: () => import('./modules/config/config.module').then(m => m.ConfigModule)
            },
        ]
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path:'logout',
        component:LogoutComponent
    },
    {
        path: 'reset',
        component: ResetComponent,
    }
];
