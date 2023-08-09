import { Routes } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { MenuComponent } from './menu/menu.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ModulesComponent } from './modules/modules.component';

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
            },
            {
                path: 'profiles',
                component: ProfilesComponent,
                data: {
                    title: 'Perfiles',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'Perfiles' }
                    ]
                }
            },
            {
                path: 'modules',
                component: ModulesComponent,
                data: {
                    title: 'Modulos',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'Modulos' }
                    ]
                }
            },
        ]
    }
];