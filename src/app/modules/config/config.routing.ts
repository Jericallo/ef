import { Routes } from '@angular/router';
import { LeyesConfigComponent } from './leyes-config/leyes-config.component';
import { AddArticleComponent } from './leyes-config/add-article/add-article.component';
import { AddCategoryComponent } from './leyes-config/add-category/add-category.component';
import { AddChapterComponent } from './leyes-config/add-chapter/add-chapter.component';
import { AddDocumentComponent } from './leyes-config/add-document/add-document.component';
import { AddParagraphComponent } from './leyes-config/add-paragraph/add-paragraph.component';
import { AddSectionComponent } from './leyes-config/add-section/add-section.component';
import { AddTitleComponent } from './leyes-config/add-title/add-title.component';

export const MainRoutes: Routes = [
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
                },
            },
            {
                path:'leyes-config',
                component:LeyesConfigComponent,
                data: {
                    title:'Configuración',
                    urls:[
                        {title:'config', url:'/config'},
                        {title:'Configuración Leyes'}
                    ]
                }
            
            },
            {
                path:'leyes-config/agregar',
                component:AddArticleComponent,
                data: {
                    title:'Add article',
                    urls:[
                        {title:'config', url:'/add'},
                        {title:'Add article'}
                    ]
                }
            
            },
        ]
    }
];