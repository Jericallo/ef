import { Routes } from "@angular/router";
import { CapacitationsComponent } from './capacitations/capacitations.component';
import { VideosComponent } from "./videos/videos.component";

export const ControlRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path:'capacitaciones',
                component:CapacitationsComponent,
                data: {
                    title:'Capacitaciones',
                    urls:[
                        {title:'Configuración', url:'/control'},
                        {title:'Capacitaciones'}
                    ]
                }
            },
            { path: 'videos', component: VideosComponent, pathMatch: 'full' },
        ]
    }
];