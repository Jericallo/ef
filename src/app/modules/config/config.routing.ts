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
import { EditCategoryComponent } from './leyes-config/edit-category/edit-category.component';
import { EditChapterComponent } from './leyes-config/edit-chapter/edit-chapter.component';
import { EditSectionComponent } from './leyes-config/edit-section/edit-section.component';
import { EditArticleComponent } from './leyes-config/edit-article/edit-article.component';
import { EditParagraphComponent } from './leyes-config/edit-paragraph/edit-paragraph.component';
import { FestiveDaysComponent } from './festive-days/festive-days.component';
import { CompaniesComponent } from './companies/companies.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PromotionalsComponent } from './promotionals/promotionals.component';
import { IntrosComponent } from './intros/intros.component';
import { NewsComponent } from './news/news.component';
import { CapacitationsComponent } from '../control/capacitations/capacitations.component';
import { CapacitationsVideosComponent } from './capacitations-videos/capacitations-videos.component';
import { CapacitationsCrudComponent } from './capacitations-crud/capacitations-crud.component';
import { QuestionCrudComponent } from './capacitations-crud/question-crud/question-crud.component';
import { ProfileGuard } from 'src/app/shared/services/profile.guard';
import { LogsComponent } from './logs/logs.component';

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
                path:'articles-edit',
                component:EditArticleComponent,
                data: {
                    title:'Editar artículo',
                    urls:[
                        {title:'Editar artículo', url:'/config'},
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
                path:'categories-edit',
                component:EditCategoryComponent,
                data: {
                    title:'Editar categoría',
                    urls:[
                        {title:'Editar categoría', url:'/config'},
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
                path:'chapters-edit',
                component:EditChapterComponent,
                data: {
                    title:'Editar capítulo',
                    urls:[
                        {title:'Editar capítulo', url:'/config'},
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
                path:'paragraphs-edit',
                component:EditParagraphComponent,
                data: {
                    title:'Editar párrafo',
                    urls:[
                        {title:'Editar párrafo', url:'/config'},
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
                path:'sections-edit',
                component:EditSectionComponent,
                data: {
                    title:'Editar sección',
                    urls:[
                        {title:'Editar sección', url:'/config'},
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
            {
                path: 'festive-days',
                component: FestiveDaysComponent,
                data: {
                    title: 'Días festivos',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'Días Festivos' }
                    ]
                }
            },
            {
                path: 'companies',
                component: CompaniesComponent,
                data: {
                    title: 'Compañías',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'Compañías' }
                    ]
                }
            },
            {
                path: 'user-profile',
                component: UserProfileComponent,
                data: {
                    title: 'Perfil del Usuario',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
            {
                path: 'promotionals',
                component: PromotionalsComponent,
                data: {
                    title: 'Videos promocionales',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
            {
                path: 'intro-videos',
                component: IntrosComponent,
                data: {
                    title: 'Videos de introducción',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
            {
                path: 'news-videos',
                component: NewsComponent,
                data: {
                    title: 'Videos de noticias',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
            {
                path: 'capacitations-videos',
                component: CapacitationsVideosComponent,
                data: {
                    title: 'Videos de capacitaciones',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
            {
                path: 'capacitations-table',
                component: CapacitationsCrudComponent,
                data: {
                    title: 'Capacitaciones',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
            {
                path: 'questionarie',
                component: QuestionCrudComponent,
                data: {
                    title: 'Cuestionario',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
            {
                path: 'questionarie',
                component: QuestionCrudComponent,
                data: {
                    title: 'Cuestionario',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
            {
                path: 'logs',
                component: LogsComponent,
                data: {
                    title: 'Acciones',
                    urls: [
                        { title: 'Configuración', url: '/config' },
                        { title: 'user-profile' }
                    ]
                }
            },
        ],
        canActivate:[ProfileGuard]
    }
];