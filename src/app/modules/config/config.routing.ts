import { Routes } from '@angular/router';

export const ConfigRoutes: Routes = [
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