import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { Article_Chapter, Article_Section, Article_Title } from 'src/app/shared/interfaces/article-interface';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<number>();
  title = "Agregar Seccion de Documento";

  /*Document Control */
  myControlDocuments= new FormControl();
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;
  
  /*Title Control */
  myControlTitles= new FormControl();
  optionsTitles: Article_Title[] = [];
  filteredTitOptions: Observable<Article_Title[]> | undefined;

  /*Chapter Control */
  myControlChapters= new FormControl();
  optionsChapters: Article_Chapter[] = [];
  filteredChaOptions: Observable<Article_Chapter[]> | undefined;

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
  selectedChapter:number = 0;
  sendingData: Article_Section = {
    id:0, nombre:"", id_documento:0, id_titulo:0, id_capitulo:0
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
    this.myControlChapters.disable()
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

  getTitles(id_documento:number){
    this.myControlTitles.disable();
    this.optionsTitles = [];
    this.filteredTitOptions = undefined
    this.apiService
    .getAllArticles(this.apiService.models.articulo_titulos,new HttpParams().set("id_documento",id_documento))
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response)
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
      error: er => {
        this.showMain = true;
        this.showSpinner = false;
        if(er.status != 400)
          this.snackBar.open('Error al cargar los titulos', '', this.config_snack);
        else
          this.getChapters(id_documento)
      },
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
    this.myControlChapters.reset();
    this.selectedTitle = opt.option.value.id;
    this.sendingData.id_titulo = opt.option.value.id;
    this.getChapters(0,opt.option.value.id)
  }

  getChapters(id_documento:number,id_titulo:number=0){
    this.myControlChapters.disable();
    this.optionsChapters = [];
    this.filteredChaOptions = undefined
    let httpParams = new HttpParams();
    if(id_documento) httpParams = httpParams.set("id_documento",id_documento)
    if(id_titulo) httpParams = httpParams.set("id_titulo",id_titulo)
    this.apiService
    .getAllArticles(this.apiService.models.articulo_capitulos,httpParams)
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response)
        this.showMain = true;this.showSpinner = false;
        this.optionsChapters = response.result;
        this.filteredChaOptions = this.myControlChapters.valueChanges.pipe(
          startWith(''),debounceTime(300),
          map(value => {
            const name = typeof value === 'string' ? value : value?.nombre;
            return name ? this._filterCha(name as string) : this.optionsChapters.slice();
          }),
        );
        this.myControlChapters.enable();
      },
      error: err => { this.errorHandling(err);}
    });
  }

  handleEmptyTit(event: any) {
    if(event.target.value === '') {}
  }

  /*Chapter Control Functions */
  private _filterCha(cha: string): Article_Chapter[] {
    return this.optionsChapters.filter(option => option.nombre?.toLowerCase().includes(cha.toLowerCase()));
  }
  
  displayChapter(cha: Article_Chapter): string {
    return cha && cha.nombre ? cha.nombre : '';
  }

  selectedCha(opt: MatAutocompleteSelectedEvent) {
    this.selectedChapter = opt.option.value.id;
    this.sendingData.id_capitulo = opt.option.value.id;
  }

  handleEmptyCha(event: any) {
    if(event.target.value === '') {}
  }

  /*Form to Save Functions*/

  checkValues() {
    return !(this.selectedDocument !== 0 && this.selectedDocument !== undefined && this.myControlName.valid)
  }

  saveAssignation() {
    this.showSpinner = true;
    this.sendingData.nombre = this.name || ""
    this.apiService.saveSection(this.sendingData)
    .subscribe({
      next: () => {
        this.showSpinner = false;
        this.snackBar.open('Seccion guardada correctamente', '', this.config_snack);
        this.resetFields();
        this.dataEvent.emit(1)
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
    this.myControlChapters.reset();
    this.selectedChapter = 0;
    this.sendingData = {id_titulo:0,id_capitulo:0,id_documento:0,id:0,nombre:""}
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
