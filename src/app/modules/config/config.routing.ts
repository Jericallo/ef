import { Routes } from '@angular/router';
import { LeyesConfigComponent } from './leyes-config/leyes-config.component';
import { AddArticleComponent } from './leyes-config/add-article/add-article.component';
import { AddCategoryComponent } from './leyes-config/add-category/add-category.component';
import { AddChapterComponent } from './leyes-config/add-chapter/add-chapter.component';
import { AddDocumentComponent } from './leyes-config/add-document/add-document.component';
import { AddParagraphComponent } from './leyes-config/add-paragraph/add-paragraph.component';
import { AddSectionComponent } from './leyes-config/add-section/add-section.component';
import { AddTitleComponent } from './leyes-config/add-title/add-title.component';

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
                path:'agregararticulo',
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
                path:'agregarcategoria',
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
                path:'agregarcapitulo',
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
                path:'agregardocumento',
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
                path:'agregarparrafo',
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
                path:'agregarseccion',
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
                path:'agregartitulo',
                component:AddTitleComponent,
                data: {
                    title:'Agregar título',
                    urls:[
                        {title:'Agregar título', url:'/config'},
                        {title:'Leyes'}
                    ]
                }
            },
        ]
    }
];