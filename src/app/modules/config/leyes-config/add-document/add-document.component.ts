import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
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
  title = "Agregar Ley";
  myForm: any;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      nombre: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    const expresionRegular = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    
    if(expresionRegular.test(this.title)){
      this.snackBar.open('No se permiten caracteres especiales', '', { 
        duration: 3000,
        verticalPosition: this.verticalPosition
      });
      return
    }

    if (this.myForm.valid) {
      const values = this.myForm.value
      const body = {
        name: values.nombre.toString(),
      }
      this.apiService.addLaw(body)
      .subscribe({
        next: response => {
          console.log(response);
          this.snackBar.open('Ley guardada correctamente', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
          this.dataEvent.emit(1)
          this.myForm.get('nombre')?.reset('');
        },
        error: err => {
          this.snackBar.open("Ocurrió un erro al guardar la Ley", '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        },
        complete: () => {}
      });
    }
  }
}