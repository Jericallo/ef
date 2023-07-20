import { Routes } from '@angular/router';

export const MainRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path:'laws',
                component:null,
                data: {
                    title: 'Leyes',
                    urls: [
                        { title: 'Leyes' }
                    ]
                }
            }
        ]
    }
];