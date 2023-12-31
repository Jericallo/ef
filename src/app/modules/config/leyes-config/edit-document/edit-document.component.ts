import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { Classifications } from 'src/app/shared/interfaces/classifications-interface';
import { Documents } from 'src/app/shared/interfaces/documents-interface';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.scss']
})
export class EditDocumentComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<number>();
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  myControlTitle = new FormControl('');

  myControlClassifications= new FormControl();
  optionsClassifications: Classifications[] = [];
  filteredClaOptions: Observable<Classifications[]> | undefined;

  myControlYear = new FormControl('');
  myControlAbbreviation = new FormControl('');
  myControlEditorial = new FormControl('');
  myControlArticles = new FormControl('');

  showMain = false;
  showSpinner = false;

  selectedClassification: Classifications[] = new Array<Classifications>();

  title: string = '';
  year: number | undefined;
  abbreviation: string = '';
  editorial: string = '';
  articles: number | undefined;

  date = new Date();
  minYear = "1993";
  maxYear = this.date.getFullYear() + 1;

  searchResults: Documents[] = [];
  searchControl = new FormControl();

  data: any = {
    id:1,
    titulo: "",
    editorial: null,
    clasificacion: [],
    abreviatura: null,
    num_articulos: 0,
    ayo: 0
  };

  selectedId = null

  mainTitle = "Editar documento";

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private globalTitle: ApiService) {
    this.globalTitle.updateGlobalTitle(this.mainTitle);
    this.showSpinner = true;
    this.apiService.getClassifications()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true;
        this.showSpinner = false;
        this.optionsClassifications = response.result;
      },
      error: er => {
        this.showMain = true;
        this.showSpinner = false;
        this.snackBar.open('Error al cargar las Clasificaciones', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        console.log(er);
      }
    });
   }

  ngOnInit(): void {
    this.getDocumentos();
    this.filteredClaOptions = this.myControlClassifications.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filterCla(name as string) : this.optionsClassifications.slice();
      }),
    );
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filterDoc(name as string) : this.searchResults.slice();
      })
      );
    
  }

  displayClassifications(cla: Classifications[] | string): string {
    let displayValue: string = "";
    if (Array.isArray(cla)) {
      cla.forEach((cla, index) => {
        if (index === 0) {
          displayValue = cla.nombre;
        } else {
          displayValue += ', ' + cla.nombre;
        }
      });
    } else {
      displayValue = cla;
    }
    return displayValue;
  }

  selectedCla(event: Event, opt: Classifications) {
    event.stopPropagation();
    this.toggleSelection(opt);
  }

  toggleSelection(op: Classifications) {
    op.selected = !op.selected;
    if(op.selected) {
      this.selectedClassification.push(op);
      this.data.clasificacion?.push(op.id);
    }else{
      const i = this.selectedClassification.findIndex(value => value.id === op.id && value.nombre === op.nombre);
      this.selectedClassification.splice(i, 1);
      this.data.clasificacion?.splice(i, 1);
    }
    this.myControlClassifications.setValue(this.selectedClassification);
  }

  handleEmptyCla(event: any) {
    event.target.value === '' ? this.selectedClassification = [] : "";
  }

  private _filterCla(cla: string): Classifications[] {
    const filteredValueCla = cla.toLocaleLowerCase();
    return this.optionsClassifications.filter(option => option.nombre.toLowerCase().includes(filteredValueCla));
  }

  private _filterDoc(doc:string): Documents[] {
    const filteredValueDoc = doc.toLocaleLowerCase();
    return this.searchResults.filter(option => option.titulo.toLowerCase().includes(filteredValueDoc))
  }

  checkValues() {
    if(this.title !== '' && this.year !== 0) {
      return false;
    } else {
      return true;
    }
  }

  checkValuesDel() {
    if(this.selectedId !== null) {
      return false;
    } else {
      return true;
    }
  }

  editDoc() {
    const expresionRegular = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
    if(expresionRegular.test(this.title) || expresionRegular.test(this.abbreviation) || expresionRegular.test(this.editorial)){
      this.snackBar.open('No se permiten caracteres especiales', '', { 
        duration: 3000,
        verticalPosition: this.verticalPosition
      });
      return
    }
    this.validateInputs();
    this.showSpinner = true;
    this.data.clasificacion = this.data.clasificacion[0]    
    delete this.data.clasificacion

    this.apiService.editDoc({data:this.data})
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response);
        this.showSpinner = false;
        this.snackBar.open('Documento editado correctamente', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.resetFields();
      },
      error: err => {
        this.showSpinner = false;
        console.log(err)
        this.snackBar.open("Error: " + JSON.stringify(err.error.message), '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      },
      complete: () => {}
    });
  }

  deleteDoc() {
    this.validateInputs();
    this.showSpinner = true;

    const data = {
      id:this.selectedId,
      estatus: 0
    }
    this.apiService.editDoc({data:data})
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response);
        this.showSpinner = false;
        this.snackBar.open('Documento eliminado correctamente', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.resetFields();
        this.dataEvent.emit(1)
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

  resetFields() {
    this.myControlTitle.reset();
    this.myControlClassifications.reset();
    this.myControlYear.reset();
    this.myControlAbbreviation.reset();
    this.myControlEditorial.reset();
    this.myControlArticles.reset();
  }

  validateInputs() {
    this.data.id = this.selectedId;
    this.data.titulo = this.title;
    this.data.ayo = this.year != undefined ? this.year : 0;
    this.data.num_articulos = 0; //Pending

    this.abbreviation != '' ? this.data.abreviatura = this.abbreviation : '';
    this.editorial != '' ? this.data.editorial = this.editorial : '';
    this.articles != undefined ? this.data.num_articulos = this.articles : '';
  }

  onChangeYear(ev: number) {
    ev > this.maxYear ? this.year = undefined : "";
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  getDocumentos(){
    this.apiService.getAllDocuments().subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response);
        this.searchResults = response.result
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

  setDoc(doc){
    console.log(doc)
    this.selectedId = doc.id

    this.title = doc.titulo
    this.year = doc.ayo
    this.abbreviation = doc.abreviatura
    this.editorial = doc.editorial
    this.articles = doc.num_articulos
  }

}
