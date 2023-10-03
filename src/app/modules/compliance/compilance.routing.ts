import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';

export const CompilanceRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path:'index',
                component:IndexComponent,
                data: {
                    title: 'Calendario',
                    urls: [
                        { title: 'Calendario' }
                    ]
                }
            },
            {
                path:'register',
                component:RegisterComponent,
                data: {
                    title: 'Registro',
                    urls: [
                        { title: 'Registro' }
                    ]
                }
            },
        ]
    }
  ];
