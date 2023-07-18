import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { NewsComponent } from './news/news.component';
import { IndexComponent } from './index/index.component';
import { LawsComponent } from './laws/laws.component';
import { TopicsComponent } from './topics/topics.component';
import {SearchComponent} from './search/search.component'
import { ResponseComponent } from './response/response.component';

export const MainRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path:'',
                component:IndexComponent,
                data: {
                    title: 'Inicio',
                    urls: [
                        { title: 'Inicio' }
                    ]
                }
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
                }
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
                }
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
                }
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
                }
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
              }
          },
          {
            path: 'response',
            component: ResponseComponent,
            data: {
                title: 'Búsqueda',
                urls: [
                    { title: 'Inicio', url: '/main' },
                    { title: 'Búsqueda' }
                ]
            }
        }
        ]
    }
  ];
