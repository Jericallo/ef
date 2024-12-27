import { Routes } from '@angular/router';
import { ProfileGuard } from 'src/app/shared/services/profile.guard';
import { MyCompanyComponent } from './my-company/my-company.component';

export const WarningRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path:'my-company',
                component:MyCompanyComponent,
                data: {
                    title: 'Mi empresa',
                    urls: [
                        { title: 'empresa' }
                    ]
                },
                canActivate:[ProfileGuard]
            },
            
        ]
    }
  ];
