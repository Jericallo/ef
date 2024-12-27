import { Routes } from "@angular/router";
import { CapacitationsComponent } from './capacitations/capacitations.component';
import { VideosComponent } from "./videos/videos.component";
import { QuestionarieComponent } from "./capacitations/questionarie/questionarie.component";
import { ChatComponent } from "./chat/chat.component";
import { ResultsComponent } from "./results/results.component";
import { QuestionnaireHistoryComponent } from "./questionnaire-history/questionnaire-history.component";

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
            {
                path:'questionarie',
                component:QuestionarieComponent,
                data: {
                    title:'Cuestionario',
                    urls:[
                        {title:'Cuestionario', url:'/control'},
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
            { path: 'resultado', 
            component: ResultsComponent, 
            pathMatch: 'full' },

            {
                path:'resultado',
                component:ChatComponent,
                data: {
                    title:'resultado',
                    urls:[
                        {title:'resultado', url:'/control'},
                        {title:'resultado'}
                    ]
                }
            },

            { path: 'questionnaire-history', 
                component: QuestionnaireHistoryComponent, 
                pathMatch: 'full' },
    
                {
                    path:'questionnaire-history',
                    component:QuestionnaireHistoryComponent,
                    data: {
                        title:'Historial de cuestionarios',
                        urls:[
                            {title:'resultado', url:'/control'},
                            {title:'resultado'}
                        ]
                    }
                },
        ]
    }
];