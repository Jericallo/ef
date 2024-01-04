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
import { UsersComponent } from './users/users.component';
import { AddUserDialogComponent } from './users/add-user-dialog/add-user-dialog.component';
import { RemoveUserDialogComponent } from './users/remove-user-dialog/remove-user-dialog.component';
import { EditUserDialogComponent } from './users/edit-user-dialog/edit-user-dialog.component';
import { MenuComponent } from './menu/menu.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { DatePipe } from '@angular/common';
import { RemoveProfileDialogComponent } from './profiles/remove-profile-dialog/remove-profile-dialog.component';
import { AddProfileDialogComponent } from './profiles/add-profile-dialog/add-profile-dialog.component';
import { EditProfileDialogComponent } from './profiles/edit-profile-dialog/edit-profile-dialog.component';
import { ModulesComponent } from './modules/modules.component';
import { AddModuleDialogComponent } from './modules/add-module-dialog/add-module-dialog.component';
import { RemoveModuleDialogComponent } from './modules/remove-module-dialog/remove-module-dialog.component';
import { EditModuleDialogComponent } from './modules/edit-module-dialog/edit-module-dialog.component';
import { AddPermissionDialogComponent } from './profiles/add-permission-dialog/add-permission-dialog.component';
import { AnswerTemplate, QuestionsComponent } from 'src/app/shared/components/questions/questions.component';
import { CapacitationsComponent } from '../control/capacitations/capacitations.component';
import { EndedVideoComponent, VideosComponent } from '../control/videos/videos.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { BrowserModule } from '@angular/platform-browser';
import {VgStreamingModule} from '@videogular/ngx-videogular/streaming';
import { ComplianceCrudComponent } from './compliance-crud/compliance-crud.component';
import { SearchDocumentComponent } from 'src/app/shared/components/search-document/search-document.component';
import { SearchDocumentationComponent } from 'src/app/shared/components/search-documentation/search-documentation.component';
import { SearchCapacitationsComponent } from 'src/app/shared/components/search-capacitations/search-capacitations.component';
import { SearchDocumentAndParagraphComponent } from 'src/app/shared/components/search-document-and-paragraph/search-document-and-paragraph.component';
import { EditDocumentComponent } from './leyes-config/edit-document/edit-document.component';
import { EditTitleComponent } from './leyes-config/edit-title/edit-title.component';
import { EditCategoryComponent } from './leyes-config/edit-category/edit-category.component';
import { EditChapterComponent } from './leyes-config/edit-chapter/edit-chapter.component';

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
    QuestionsComponent,
    UsersComponent,
    AddUserDialogComponent,
    EditUserDialogComponent,
    RemoveUserDialogComponent,
    MenuComponent,
    ProfilesComponent,
    RemoveProfileDialogComponent,
    AddProfileDialogComponent,
    EditProfileDialogComponent,
    ModulesComponent,
    AddModuleDialogComponent,
    RemoveModuleDialogComponent,
    EditModuleDialogComponent,
    AddPermissionDialogComponent,
    AnswerTemplate,
    ComplianceCrudComponent,    
    SearchDocumentComponent,
    SearchDocumentationComponent,
    SearchCapacitationsComponent,
    SearchDocumentAndParagraphComponent,
    EditDocumentComponent,
    EditTitleComponent,
    EditCategoryComponent,
    EditChapterComponent
  ],
  providers: [DatePipe, CapacitationsComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AngularEditorModule,
    RouterModule.forChild(ConfigRoutes),
    DemoMaterialModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule
  ],
  exports: [
    SearchDocumentComponent,
    SearchDocumentationComponent,
    SearchCapacitationsComponent,
    SearchDocumentAndParagraphComponent
  ]
})
export class ConfigModule { }
