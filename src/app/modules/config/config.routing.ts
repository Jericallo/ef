import { Routes } from '@angular/router';
import { LeyesConfigComponent } from './leyes-config/leyes-config.component';
import { AddArticleComponent } from './leyes-config/add-article/add-article.component';
import { AddCategoryComponent } from './leyes-config/add-category/add-category.component';
import { AddChapterComponent } from './leyes-config/add-chapter/add-chapter.component';
import { AddDocumentComponent } from './leyes-config/add-document/add-document.component';
import { EditDocumentComponent } from './leyes-config/edit-document/edit-document.component';
import { AddParagraphComponent } from './leyes-config/add-paragraph/add-paragraph.component';
import { AddSectionComponent } from './leyes-config/add-section/add-section.component';
import { AddTitleComponent } from './leyes-config/add-title/add-title.component';
import { UsersComponent } from './users/users.component';
import { MenuComponent } from './menu/menu.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { ModulesComponent } from './modules/modules.component';
import { ComplianceCrudComponent } from './compliance-crud/compliance-crud.component';
import { EditTitleComponent } from './leyes-config/edit-title/edit-title.component';

export const ConfigRoutes: Routes = [
    {
        path:'',
        children:[
            {
                path:'',
                component:LeyesConfigComponent,
                data: {
                    title: 'Leyes',
                    urls: [
                        { title: 'Leyes' }
                    ]
                },
            },
            {
                path:'articles',
                component:AddArticleComponent,
                data: {
                    title:'Agregar artículo',
                    urls:[
                        {title:'Agregar artículo', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            
            },
            {
                path:'categories',
                component:AddCategoryComponent,
                data: {
                    title:'Agregar categoría',
                    urls:[
                        {title:'Agregar categoría', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            
            },
            {
                path:'chapters',
                component:AddChapterComponent,
                data: {
                    title:'Agregar capítulo',
                    urls:[
                        {title:'Agregar capítulo', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            
            },
            {
                path:'documents',
                component:AddDocumentComponent,
                data: {
                    title:'Agregar documento',
                    urls:[
                        {title:'Agregar documento', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            
            },
            {
                path:'documents-edit',
                component:EditDocumentComponent,
                data: {
                    title:'Editar documento',
                    urls:[
                        {title:'Editar documento', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            
            },
            {
                path:'paragraphs',
                component:AddParagraphComponent,
                data: {
                    title:'Agregar párrafo',
                    urls:[
                        {title:'Agregar párrafo', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            
            },
            {
                path:'sections',
                component:AddSectionComponent,
                data: {
                    title:'Agregar sección',
                    urls:[
                        {title:'Agregar sección', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            },
            {
                path:'titles',
                component:AddTitleComponent,
                data: {
                    title:'Agregar título',
                    urls:[
                        {title:'Agregar título', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            },
            {
                path:'titles-edit',
                component:EditTitleComponent,
                data: {
                    title:'Editar título',
                    urls: [
                        {title:'Editar título', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            },
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
            {
                path: 'compliance',
                component: ComplianceCrudComponent,
                data: {
                    title: 'Cumplimiento',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'Cumplimiento' }
                    ]
                }
            },
            
        ]
    }
];