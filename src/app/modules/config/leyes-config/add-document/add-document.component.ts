import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { Classifications } from 'src/app/shared/interfaces/classifications-interface';
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-document',
  templateUrl: './add-document.component.html',
  styleUrls: ['./add-document.component.css']
})
export class AddDocumentComponent implements OnInit {
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

  sendingDocument: any = {
    titulo: "",
    editorial: null,
    clasificacion: null,
    abreviatura: null,
    num_articulos: 0,
    ayo: 0
  };

  mainTitle = "Agregar documento";

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

  ngOnInit() {
    this.filteredClaOptions = this.myControlClassifications.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filterCla(name as string) : this.optionsClassifications.slice();
      }),
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
      console.log(op)
      this.selectedClassification.push(op);
      this.sendingDocument.clasificacion = this.selectedClassification
      console.log(this.sendingDocument.clasificacion)
    }else{
      const i = this.selectedClassification.findIndex(value => value.id === op.id && value.nombre === op.nombre);
      this.selectedClassification.splice(i, 1);
      this.sendingDocument.clasificacion?.splice(i, 1);
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

  checkValues() {
    if(this.title !== '' && this.year !== 0) {
      return false;
    } else {
      return true;
    }
  }

  saveDocument() {
    const expresionRegular = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    console.log(this.title)
    if(expresionRegular.test(this.title)){
      this.snackBar.open('No se permiten caracteres especiales', '', { 
        duration: 3000,
        verticalPosition: this.verticalPosition
      });
      return
    }

    this.validateInputs();
    this.showSpinner = true;
    console.log(this.sendingDocument)
    this.sendingDocument.clasificacion = this.sendingDocument.clasificacion[0].id
    //this.sendingDocument.clasificacion = 6
    console.log(this.sendingDocument)
    this.apiService.saveDocument(this.sendingDocument)
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response);
        this.showSpinner = false;
        this.snackBar.open('Documento guardado correctamente', '', { 
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
    this.sendingDocument.titulo = this.title;
    this.sendingDocument.ayo = this.year != undefined ? this.year : 0;
    this.sendingDocument.num_articulos = 0; //Pending

    this.abbreviation != '' ? this.sendingDocument.abreviatura = this.abbreviation : '';
    this.editorial != '' ? this.sendingDocument.editorial = this.editorial : '';
    this.articles != undefined ? this.sendingDocument.num_articulos = this.articles : '';
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

}
