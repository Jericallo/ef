import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { LeyesConfigComponent } from './leyes-config/leyes-config.component';
import { AddArticleComponent } from './leyes-config/add-article/add-article.component';
import { AddCategoryComponent } from './leyes-config/add-category/add-category.component';
import { AddChapterComponent } from './leyes-config/add-chapter/add-chapter.component';
import { AddDocumentComponent } from './leyes-config/add-document/add-document.component';
import { AddTitleComponent } from './leyes-config/add-title/add-title.component';
import { AddSectionComponent } from './leyes-config/add-section/add-section.component';
import { AddParagraphComponent } from './leyes-config/add-paragraph/add-paragraph.component';
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
import { EditSectionComponent } from './leyes-config/edit-section/edit-section.component';
import { EditArticleComponent } from './leyes-config/edit-article/edit-article.component';
import { EditParagraphComponent } from './leyes-config/edit-paragraph/edit-paragraph.component';
import { FestiveDaysComponent } from './festive-days/festive-days.component';
import { CompaniesComponent } from './companies/companies.component';
import { AddCompanyDialogComponent } from './companies/add-company-dialog/add-company-dialog.component';
import { EditCompaniesDialogComponent } from './companies/edit-companies-dialog/edit-companies-dialog.component';
import { EditCompanyDialogComponent } from './companies/edit-company-dialog/edit-company-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PasswordChangeComponent } from './user-profile/password-change/password-change.component';
import { PromotionalsComponent } from './promotionals/promotionals.component';
import { AddPromotionalComponent } from './promotionals/add-promotional/add-promotional.component';
import { DeletePromotionalComponent } from './promotionals/delete-promotional/delete-promotional.component';
import { IntrosComponent } from './intros/intros.component';
import { EditIntrosComponent } from './intros/edit-intros/edit-intros.component';
import { NewsComponent } from './news/news.component';
import { DeleteNewsComponent } from './news/delete-news/delete-news.component';
import { AddNewsComponent, MY_FORMATS } from './news/add-news/add-news.component';
import { DateAdapter } from 'angular-calendar';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CapacitationsVideosComponent } from './capacitations-videos/capacitations-videos.component';
import { AddCapacitationsVideosComponent } from './capacitations-videos/add-capacitations-videos/add-capacitations-videos.component';
import { DeleteCapacitationsVideosComponent } from './capacitations-videos/delete-capacitations-videos/delete-capacitations-videos.component';
import { CapacitationsCrudComponent } from './capacitations-crud/capacitations-crud.component';
import { AddCapacitationsComponent } from './capacitations-crud/add-capacitations/add-capacitations.component';
import { AssignVideoComponent } from './capacitations-crud/assign-video/assign-video.component';
import { QuestionCrudComponent } from './capacitations-crud/question-crud/question-crud.component';

import localeEsAr from '@angular/common/locales/es-AR';
import { LogsComponent } from './logs/logs.component';
import { DocumentationsCatalogComponent } from './documentations-catalog/documentations-catalog.component';
import { AddDocumentationsDialogComponent } from './documentations-catalog/add-documentations-dialog/add-documentations-dialog.component';
import { EditDocumentationsDialogComponent } from './documentations-catalog/edit-documentations-dialog/edit-documentations-dialog.component';
import { AddBookComponent } from './leyes-config/add-book/add-book.component';
import { AddPartComponent } from './leyes-config/add-part/add-part.component';
import { AddFractionComponent } from './leyes-config/add-fraction/add-fraction.component';
import { AddPointComponent } from './leyes-config/add-point/add-point.component';
import { MonthlyQuestionarComponent } from './monthly-questionar/monthly-questionar.component';
import { AddQuestionDialogComponent } from './monthly-questionar/add-question-dialog/add-question-dialog.component';
import { EditQuestionDialogComponent } from './monthly-questionar/edit-question-dialog/edit-question-dialog.component';
import { RemoveQuestionComponent } from './monthly-questionar/remove-question/remove-question.component';

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    LeyesConfigComponent,
    AddArticleComponent,
    AddCategoryComponent,
    AddChapterComponent,
    AddDocumentComponent,
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
    EditChapterComponent,
    EditSectionComponent,
    EditArticleComponent,
    EditParagraphComponent,
    FestiveDaysComponent,
    CompaniesComponent,
    AddCompanyDialogComponent,
    EditCompaniesDialogComponent,
    EditCompanyDialogComponent,
    UserProfileComponent,
    PasswordChangeComponent,
    PromotionalsComponent,
    AddPromotionalComponent,
    DeletePromotionalComponent,
    IntrosComponent,
    EditIntrosComponent,
    NewsComponent,
    DeleteNewsComponent,
    AddNewsComponent,
    CapacitationsVideosComponent,
    AddCapacitationsVideosComponent,
    DeleteCapacitationsVideosComponent,
    CapacitationsCrudComponent,
    AddCapacitationsComponent,
    AssignVideoComponent,
    QuestionCrudComponent,
    LogsComponent,
    DocumentationsCatalogComponent,
    AddDocumentationsDialogComponent,
    EditDocumentationsDialogComponent,
    AddBookComponent,
    AddPartComponent,
    AddFractionComponent,
    AddPointComponent,
    MonthlyQuestionarComponent,
    AddQuestionDialogComponent,
    EditQuestionDialogComponent,
    RemoveQuestionComponent
  ],
  providers: [DatePipe, CapacitationsComponent,
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    { provide: LOCALE_ID, useValue: 'es-Ar' }
  ],
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
