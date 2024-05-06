import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { NewsComponent } from './news/news.component';
import { LawsComponent } from './laws/laws.component';
import { TopicsComponent } from './topics/topics.component';
import {SearchComponent} from './search/search.component'
import { ResponseComponent } from './response/response.component';
import { VideoIntroComponent } from './video-intro/video-intro.component';
import { ProfileGuard } from 'src/app/shared/services/profile.guard';

export const MainRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path:'',
                component:NewsComponent,
                data: {
                    title: 'Inicio',
                    urls: [
                        { title: 'Inicio' }
                    ]
                },
                canActivate:[ProfileGuard]
            },
            {
                path: 'intro',
                component: IntroComponent,
                data: {
                    title: 'Intro',
                    urls: [
                        { title: 'Inicio', url: '/main' },
                        { title: 'Intro' }
                    ]
                },
                canActivate:[ProfileGuard]
            },
            {
                path: 'news',
                component: NewsComponent,
                data: {
                    title: 'Noticias',
                    urls: [
                        { title: 'Inicio', url: '/main' },
                        { title: 'Noticias' }
                    ]
                },
                canActivate:[ProfileGuard]
            },
            {
                path: 'laws',
                component: LawsComponent,
                data: {
                    title: 'Leyes',
                    urls: [
                        { title: 'Inicio', url: '/main' },
                        { title: 'Leyes' }
                    ]
                },
                canActivate:[ProfileGuard]
            },
            {
                path: 'topics',
                component: TopicsComponent,
                data: {
                    title: 'Temario',
                    urls: [
                        { title: 'Inicio', url: '/main' },
                        { title: 'Temario' }
                    ]
                },
                canActivate:[ProfileGuard]
            },
            {
              path: 'busqueda',
              component: SearchComponent,
              data: {
                  title: 'Búsqueda',
                  urls: [
                      { title: 'Inicio', url: '/main' },
                      { title: 'Búsqueda' }
                  ]
              },
              canActivate:[ProfileGuard]
          },
          {
            path: 'response',
            component: ResponseComponent,
            data: {
                title: 'Búsqueda',
                urls: [
                    { title: 'Inicio', url: '/main' },
                    { title: 'Respuesta' }
                ]
            },
            canActivate:[ProfileGuard]
        },
        {
            path: 'videoIntro',
            component: VideoIntroComponent,
            data: {
                title: 'Video Introducción',
                urls: [
                    { title: 'Inicio', url: '/main' },
                    { title: 'Introducción' }
                ]
            },
            canActivate:[ProfileGuard]
        }
        ]
    }
  ];
