import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  title = "Agregar Titulo de Documento";
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  myForm: FormGroup;
  leyes = [];
  libros = []; 
  libroHabilitado = false; // Controla si el combo de libro está habilitado
  inputsHabilitados = false; // Controla si los inputs están habilitados
  conservarLey = false;
  conservarLibro = false;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      ley: ['', Validators.required],
      libro: [''], // Opcional
      nombre: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    this.myForm.get('ley')?.valueChanges.subscribe(value => {
      this.libroHabilitado = !!value; // Habilita el combo de libro si hay una ley seleccionada
      this.inputsHabilitados = !!value; // Habilita los inputs si hay una ley seleccionada
      if (value) {
        this.fetchBooks(value); // Solo se ejecuta si hay un valor de ley seleccionado
      }
    });

    this.fetchLaws()
  }

  fetchLaws():void {
    this.apiService.getLeyes().subscribe({
      next: res => {
        this.leyes = res
      }, error: err => {
        this.snackBar.open('Ocurrió un error al recuperar las leyes', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    })
  }

  fetchBooks(id:string):void {
    this.apiService.fetchBooks(`?lawId=${id}`).subscribe({
      next: res => {
        this.libros = res
      }, error: err => {
        console.error(err)
        this.snackBar.open('Ocurrió un erro al recuperar los libros', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    })
  }

  onLeyChange(event: any): void {
    const leySeleccionada = event.target.value;
    if (leySeleccionada) {
      this.libroHabilitado = true;
      this.inputsHabilitados = true;
    } else {
      this.libroHabilitado = false;
      this.inputsHabilitados = false;
    }
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      const values = this.myForm.value
      const body = {
        name: values.nombre.toString(),
        number:values.numero.toString(),
        lawId:values.ley.toString(),
        bookId: values.libro === '' ? null : values.libro.toString()
      }

      if(body.bookId === null) {
        delete body.bookId
      } else {
        delete body.lawId
      }

      this.apiService.addTitle(body).subscribe({
        next: res => {
          if (!this.conservarLey) {
            this.myForm.get('ley')?.reset('');
          }
          if (!this.conservarLibro) {
            this.myForm.get('libro')?.reset('');
          }
          this.myForm.get('nombre')?.reset('');
          this.myForm.get('numero')?.reset('');
          
          // Deshabilitar inputs si no hay ley seleccionada
          this.libroHabilitado = false;
          this.inputsHabilitados = false;
          this.snackBar.open('título guardado correctamente', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }, error: err => {
          console.error(err)
          this.snackBar.open('Ocurrió un erro al guardar el título', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }
      })


      // Limpiar campos
      
    }
  }
}
