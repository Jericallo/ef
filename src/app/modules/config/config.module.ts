import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeyesConfigComponent } from './leyes-config/leyes-config.component';
import { AddArticleComponent } from './leyes-config/add-article/add-article.component';
import { AddCategoryComponent } from './leyes-config/add-category/add-category.component';
import { AddChapterComponent } from './leyes-config/add-chapter/add-chapter.component';
import { AddDocumentComponent } from './leyes-config/add-document/add-document.component';
import { AddTitleComponent } from './leyes-config/add-title/add-title.component';
import { AddSectionComponent } from './leyes-config/add-section/add-section.component';
import { AddParagraphComponent } from './leyes-config/add-paragraph/add-paragraph.component';
import { DialogTemplate } from './leyes-config/add-article/add-article.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigRoutes } from './config.routing';
import { RouterModule } from '@angular/router';
import { DemoMaterialModule } from 'src/app/demo-material-module';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SearchDocumentComponent } from 'src/app/shared/components/search-document/search-document.component';

@NgModule({
  declarations: [
    LeyesConfigComponent,
    AddArticleComponent,
    AddCategoryComponent,
    AddChapterComponent,
    AddDocumentComponent,
    DialogTemplate,
    AddTitleComponent,
    AddSectionComponent,
    AddParagraphComponent,
    SearchDocumentComponent,
    
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AngularEditorModule,
    RouterModule.forChild(ConfigRoutes),
    DemoMaterialModule
  ]
})
export class ConfigModule { }
