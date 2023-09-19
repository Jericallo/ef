import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';

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
        ]
    }
  ];
