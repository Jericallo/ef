import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { Article_Title } from 'src/app/shared/interfaces/article-interface';

@Component({
  selector: 'app-edit-title',
  templateUrl: './edit-title.component.html',
  styleUrls: ['./edit-title.component.scss']
})
export class EditTitleComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<number>();
  title = "Editar Titulo de Documento";

  /*Document Control */
  myControlDocuments= new FormControl();
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;
  filteredDocSearchOptions: Observable<Documents[]> | undefined;
  filteredTitlesOptions: Observable<any[]> | undefined;

  /*Name Control */
  myControlName = new FormControl('');
  name: string | undefined;

  showMain = true;
  showSpinner = false;

  verticalPosition: MatSnackBarVerticalPosition = 'top';

  selectedDocument: number = 0;
  sendingData: Article_Title = {
    id:0, nombre:"", id_documento:0
  }

  selectedDocId = null
  selectedTitId = null

  searchResultsDoc = []
  searchResultsTit = []

  searchControl = new FormControl();
  searchControlTitle = new FormControl();

  selectedDocumentText = ''


  constructor(public apiService: ApiService, public snackBar: MatSnackBar) {
    this.apiService.getDocuments()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true;
        this.showSpinner = false;
        console.log(response);
        this.optionsDocuments = response.result;
      },
      error: err => {
        this.errorHandling(err);
      }
    });
   }

  ngOnInit(): void {
    this.filteredDocOptions = this.myControlDocuments.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const title = typeof value === 'string' ? value : value?.titulo;
        return title ? this._filterDoc(title as string) : this.optionsDocuments.slice();
      }),
    );

    this.getDocumentos()

    this.filteredDocSearchOptions = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filterDocSearch(name as string) : this.searchResultsDoc.slice();
      })
      );
  }

  private _filterDoc(tit: string): Documents[] {
    return this.optionsDocuments.filter(option => option.titulo?.toLowerCase().includes(tit.toLowerCase()));
  }

  private _filterDocSearch(tit: string): Documents[] {
    return this.searchResultsDoc.filter(option => option.titulo?.toLowerCase().includes(tit.toLowerCase()));
  }

  private _filterTit(tit: string): any[] {
    return this.searchResultsTit.filter(option => option.nombre?.toLowerCase().includes(tit.toLowerCase()));
  }

  errorHandling(err: any) {
    this.showMain = true;
        this.showSpinner = false;
        this.snackBar.open('Error al cargar las Documentos', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
    console.log(err);
  }

  selectedDoc(opt: MatAutocompleteSelectedEvent) {
    this.selectedDocument = opt.option.value.id;
    this.sendingData.id_documento = opt.option.value.id;
  }

  handleEmptyDoc(event: any) {
    if(event.target.value === '') {
      //this.selectedObligations = [];
      //this.sendingData.id_regimen = null;
      //this.selectedRegime = 0;
    }
  }

  displayDocument(doc: Documents): string {
    return doc && doc.titulo ? doc.titulo : '';
  }
  

  /**
   * Funciones para Formulario completo
   */

  checkValues() {
    return !(this.selectedDocument !== 0 && this.selectedDocument !== undefined && this.myControlName.valid)
  }

  modTit() {
    const expresionRegular = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if(expresionRegular.test(this.name)){
      this.snackBar.open('No se permiten caracteres especiales', '', { 
        duration: 3000,
        verticalPosition: this.verticalPosition
      });
      return
    }
    this.showSpinner = true;
    this.sendingData.nombre = this.name || ""
    this.sendingData.id = this.selectedTitId
    console.log(this.sendingData)
    this.apiService.editTit({data:this.sendingData})
    .subscribe({
      next: response => {
        
        this.showSpinner = false;
        console.log(response);
        this.snackBar.open('Titulo modificado correctamente', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.resetFields();
        this.dataEvent.emit(1)
      },
      error: err => {
        this.showSpinner = false;
        console.log(err);
        this.snackBar.open("Error: " + JSON.stringify(err.error.message), '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.resetFields();
      }
    });
  }

  delTit(){
    this.showSpinner = true;
    let body = {
      id:this.selectedTitId,
      estatus:0
    }
    this.apiService.editTit({data:body})
    .subscribe({
      next: response => {
        
        this.showSpinner = false;
        console.log(response);
        this.snackBar.open('Titulo eliminado correctamente', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.resetFields();
        this.dataEvent.emit(1)
      },
      error: err => {
        this.showSpinner = false;
        console.log(err);
        this.snackBar.open("Error: " + JSON.stringify(err.error.message), '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.resetFields();
      }
    });
  }

  resetFields() {
    this.myControlDocuments.reset();
    this.selectedDocument = 0;
    this.name = "";
  }

  setDoc(doc){
    console.log(doc)
    this.selectedDocId = doc.id
    this.getTitulos()
    this.selectedDocument = doc.id;
    this.sendingData.id_documento = doc.id;

    this.myControlDocuments.setValue(doc)
    this.searchControl.setValue(doc)
  }

  setTit(doc){
    console.log(doc)
    this.selectedTitId = doc.id

    this.name = doc.nombre
  }

  getDocumentos(){
    this.apiService.getAllDocuments2().subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response);
        this.searchResultsDoc = response.result
      },
      error: err => {
        this.showSpinner = false;
        this.snackBar.open("Error: " + JSON.stringify(err.error.message), '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      },
      complete: () => {}
    });
  }

  getTitulos(){
    this.apiService.getAll('articulo_titulo').subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message, 'private'));
        this.searchResultsTit = response.result
        console.log(response.result)
        this.filteredTitlesOptions = this.searchControlTitle.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => {
            const name = typeof value === 'string' ? value : value?.nombre;
            return name ? this._filterTit(name as string) : this.searchResultsTit.slice();
          })
          );
      }, error: err => {
        this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
          duration:3000,
          verticalPosition:this.verticalPosition
        })
      }
    })
  }
}