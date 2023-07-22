import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { Documents } from '../../entities/documents-interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { Article_Chapter, Article_Title } from '../../entities/article-interface';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.css']
})
export class AddChapterComponent implements OnInit {

  title = "Agregar Capitulo de Documento";

  /*Document Control */
  myControlDocuments= new FormControl();
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;
  
  /*Title Control */
  myControlTitles= new FormControl();
  optionsTitles: Article_Title[] = [];
  filteredTitOptions: Observable<Article_Title[]> | undefined;

  /*Name Control */
  myControlName = new FormControl('');
  name: string | undefined;

  showMain = true;
  showSpinner = false;

  /*Snackbar */
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  selectedDocument: number = 0;
  selectedTitle:number = 0;
  sendingData: Article_Chapter = {
    id:0, nombre:"", id_documento:0, id_titulo:0
  }

  constructor(public apiService: ApiService, public snackBar: MatSnackBar) {
    this.apiService.getDocuments()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true;this.showSpinner = false;
        this.optionsDocuments = response.result;
      },
      error: err => { this.errorHandling(err);}
    });
   }

  ngOnInit(): void {
    this.filteredDocOptions = this.myControlDocuments.valueChanges.pipe(
      startWith(''),debounceTime(300),
      map(value => {
        const title = typeof value === 'string' ? value : value?.titulo;
        return title ? this._filterDoc(title as string) : this.optionsDocuments.slice();
      }),
    );
    this.myControlTitles.disable()
  }

  /*Document Control Functions */
  private _filterDoc(doc: string): Documents[] {
    return this.optionsDocuments.filter(option => option.titulo?.toLowerCase().includes(doc.toLowerCase()));
  }
  
  displayDocument(doc: Documents): string {
    return doc && doc.titulo ? doc.titulo : '';
  }

  selectedDoc(opt: MatAutocompleteSelectedEvent) {
    this.myControlTitles.reset();
    this.selectedDocument = opt.option.value.id;
    this.sendingData.id_documento = opt.option.value.id;
    this.getTitles(opt.option.value.id);
  }

  getTitles(id_document:number){
    this.myControlTitles.disable();
    this.optionsTitles = [];
    this.filteredTitOptions = undefined
    this.apiService
    .getAllArticles(this.apiService.models.articulo_titulos,new HttpParams().set("id_documento",id_document))
  .subscribe({
    next: response => {
      response = JSON.parse(this.apiService.decrypt(response.message,"private"));
      this.showMain = true;this.showSpinner = false;
      this.optionsTitles = response.result;
      this.filteredTitOptions = this.myControlTitles.valueChanges.pipe(
        startWith(''),debounceTime(300),
        map(value => {
          const name = typeof value === 'string' ? value : value?.nombre;
          return name ? this._filterTit(name as string) : this.optionsTitles.slice();
        }),
      );
      this.myControlTitles.enable();
    },
    error: err => { this.errorHandling(err);}
  });
  }

  handleEmptyDoc(event: any) {
    if(event.target.value === '') {
    }
  }

  /*Title Control Functions */
  private _filterTit(tit: string): Article_Title[] {
    return this.optionsTitles.filter(option => option.nombre?.toLowerCase().includes(tit.toLowerCase()));
  }
  
  displayTitle(tit: Article_Title): string {
    return tit && tit.nombre ? tit.nombre : '';
  }

  selectedTit(opt: MatAutocompleteSelectedEvent) {
    this.selectedTitle = opt.option.value.id;
    this.sendingData.id_titulo = opt.option.value.id;
  }

  handleEmptyTit(event: any) {
    if(event.target.value === '') {}
  }

  /*Form to Save Functions*/

  checkValues() {
    return !(this.selectedDocument !== 0 && this.selectedDocument !== undefined && this.myControlName.valid)
  }

  saveAssignation() {
    this.showSpinner = true;
    this.sendingData.nombre = this.name || ""
    this.apiService.saveArticleChapter(this.sendingData)
    .subscribe({
      next: response => {
        this.showSpinner = false;
        this.snackBar.open('Capitulo guardado correctamente', '', this.config_snack);
        this.resetFields();
      },
      error: err => {
        this.showSpinner = false;
        this.snackBar.open("Error: " + JSON.stringify(err.error.message), '', this.config_snack);
        this.resetFields();
      }
    });
  }

  resetFields() {
    this.myControlDocuments.reset();
    this.selectedDocument = 0;
    this.myControlTitles.reset();
    this.selectedTitle = 0;
    this.sendingData.id_titulo = 0;
    this.name = "";
  }

  errorHandling(err: any) {
    if(err.status != 400){
      this.showMain = true;
      this.showSpinner = false;
      this.snackBar.open('Error al cargar los Documentos', '', this.config_snack);
    }
    console.log(err);
  }

}
