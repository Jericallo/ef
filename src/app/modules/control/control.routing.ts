import { Routes } from "@angular/router";
import { CapacitationsComponent } from './capacitations/capacitations.component';
import { VideosComponent } from "./videos/videos.component";
import { QuestionarieComponent } from "./questionarie/questionarie.component";
import { ChatComponent } from "./chat/chat.component";

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
            {
                path:'cuestionario',
                component:QuestionarieComponent,
                data: {
                    title:'cuestionario',
                    urls:[
                        {title:'Cuestionario', url:'/control'},
                        {title:'Cuestionario'}
                    ]
                }
            },

            { path: 'videos', 
            component: VideosComponent, 
            pathMatch: 'full' },

            {
                path:'ayuda',
                component:ChatComponent,
                data: {
                    title:'Ayuda',
                    urls:[
                        {title:'Ayuda', url:'/control'},
                        {title:'Ayuda'}
                    ]
                }
            },
        ]
    }
];