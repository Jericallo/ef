import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { Article_Title } from 'src/app/shared/interfaces/article-interface';

@Component({
  selector: 'app-add-title',
  templateUrl: './add-title.component.html',
  styleUrls: ['./add-title.component.css']
})
export class AddTitleComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<number>();
  title = "Agregar Titulo de Documento";

  /*Document Control */
  myControlDocuments= new FormControl();
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;

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
  }

  private _filterDoc(tit: string): Documents[] {
    return this.optionsDocuments.filter(option => option.titulo?.toLowerCase().includes(tit.toLowerCase()));
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

  saveAssignation() {
    this.showSpinner = true;
    this.sendingData.nombre = this.name || ""
    this.apiService.saveArticleTitle(this.sendingData)
    .subscribe({
      next: response => {
        
        this.showSpinner = false;
        console.log(response);
        this.snackBar.open('Titulo guardado correctamente', '', { 
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

}
