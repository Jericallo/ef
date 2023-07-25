import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { MenuComponent } from './menu/menu.component';

export const ConfigRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path: 'users',
                component: UsersComponent,
                data: {
                    title: 'Usuarios',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'Usuarios' }
                    ]
                }
            },
            {
                path: 'menu',
                component:MenuComponent,
                data:{
                    title:'Menu Configuraciones'
                }
            }
        ]
    }
];