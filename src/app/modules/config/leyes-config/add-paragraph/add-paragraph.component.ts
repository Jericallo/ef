import { Component, OnInit, Inject, ChangeDetectorRef} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
//import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { MatRadioChange } from '@angular/material/radio';

//Services
import { ApiService } from 'src/app/shared/services/api.service';

//Interfaces
import { Documents } from '../../entities/documents-interface';
import { Article, Article_Chapter, Article_Title, Article_Section } from '../../entities/article-interface';
import { ArticleRelation } from '../../entities/article-relation-interface';

@Component({
  selector: 'app-add-paragraph',
  templateUrl: './add-paragraph.component.html',
  styleUrls: ['./add-paragraph.component.css']
})
export class AddParagraphComponent implements OnInit {
  title = "Agregar Parrafo/Fracción";
  showSpinner = false;
  showMain = false;

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  myControlDocuments = new FormControl<string | Documents>('');
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;

  myControlTitles = new FormControl<string | Article_Title>('');
  optionsTitles: Article_Title[] = [];
  filteredTitOptions: Observable<Article_Title[]> | undefined;

  myControlChapters = new FormControl<string | Article_Chapter>('');
  optionsChapters: Article_Chapter[] = [];
  filteredChaOptions: Observable<Article_Chapter[]> | undefined;

  myControlSections = new FormControl<string | Article_Section>('');
  optionsSections: Article_Section[] = [];
  filteredSecOptions: Observable<Article_Section[]> | undefined;

  myControlArticles = new FormControl<string | Article>('');
  optionsArticles: Article[] = [];
  filteredArtOptions: Observable<Article[]> | undefined;

  constructor(public serv: ApiService, public snackBar: MatSnackBar, private readonly cdRef: ChangeDetectorRef, public dialog: MatDialog,
    private globalTitle: ApiService) {
      this.globalTitle.updateGlobalTitle(this.title);
      this.showSpinner = true;
      this.getDocuments();
  }

  ngOnInit(): void {
  }

  /**
   * AUTOCOMPLETE FUNCTIONS
   */
  displayWith(obj:any){
    if(!obj) return '';
    if((obj as Documents).titulo !== 'undefined') return obj.titulo ? obj.titulo : '';
    else if((obj as Article_Title).nombre !== 'undefined') return obj.nombre ? obj.nombre : '';
    else if((obj as Article_Chapter).nombre !== 'undefined') return obj.nombre ? obj.nombre : '';
    else if((obj as Article_Section).nombre !== 'undefined') return obj.nombre ? obj.nombre : '';
    else if((obj as Article).nombre !== 'undefined') return obj.nombre ? obj.nombre : '';
    else return '';
  }

  /**
   * API REQUESTS
   */
  private getDocuments() {
    this.serv.getAll(this.serv.models.documentos)
      .subscribe({
        next: response => {this.showMain = true;this.showSpinner = false;this.optionsDocuments = response.result;},
        error: er => {console.log(er);this.showMain = true;this.showSpinner = false;this.snackBar.open('Error loading documents', '', this.config_snack);},
        complete: () => {}
      });
  }

  private getTitles() {
    this.serv.getAll(this.serv.models.articulo_titulos)
      .subscribe({
        next: response => {this.showMain = true;this.showSpinner = false;this.optionsTitles = response.result;},
        error: er => {console.log(er);this.showMain = true;this.showSpinner = false;this.snackBar.open('Error loading titles', '', this.config_snack);},
        complete: () => {}
      });
  }

  private getChapters() {
    this.serv.getAll(this.serv.models.articulo_capitulos)
      .subscribe({
        next: response => {this.showMain = true;this.showSpinner = false;this.optionsChapters = response.result;},
        error: er => {console.log(er);this.showMain = true;this.showSpinner = false;this.snackBar.open('Error loading chapters', '', this.config_snack);},
        complete: () => {}
      });
  }

  private getSections() {
    this.serv.getAll(this.serv.models.articulo_secciones)
      .subscribe({
        next: response => {this.showMain = true;this.showSpinner = false;this.optionsSections = response.result;},
        error: er => {console.log(er);this.showMain = true;this.showSpinner = false;this.snackBar.open('Error loading sections', '', this.config_snack);},
        complete: () => {}
      });
  }

  private getArticles() {
    this.serv.getAll(this.serv.models.articulos)
      .subscribe({
        next: response => {this.showMain = true;this.showSpinner = false;this.optionsArticles = response.result;},
        error: er => {console.log(er);this.showMain = true;this.showSpinner = false;this.snackBar.open('Error loading articles', '', this.config_snack);},
        complete: () => {}
      });
  }

}
