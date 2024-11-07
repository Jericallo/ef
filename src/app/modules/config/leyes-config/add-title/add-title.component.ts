import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';


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

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      ley: ['', Validators.required],
      conservarLey:[false],
      libro: [{value:'', disabled:true}], // Opcional
      conservarLibro:[false],
      nombre: [{value:'', disabled:true}, Validators.required],
      numero: [{value:'', disabled:true}, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    this.myForm.get('ley')?.valueChanges.subscribe(value => {
      if (value) {
        this.myForm.get('libro')?.enable()
        this.myForm.get('nombre')?.enable()
        this.myForm.get('numero')?.enable()
        this.fetchBooks(value); // Solo se ejecuta si hay un valor de ley seleccionado
      } else {
        this.myForm.get('libro')?.disable()
        this.myForm.get('nombre')?.disable()
        this.myForm.get('numero')?.disable()
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
          if (!values.conservarLey) {
            this.myForm.get('ley')?.reset('');
            this.myForm.get('nombre')?.disable();
            this.myForm.get('numero')?.disable();
            this.myForm.get('libro')?.disable()
            this.myForm.get('libro')?.reset('')
          }

          if (!values.conservarLibro) {
            this.myForm.get('libro')?.reset('');
          }

          this.myForm.get('nombre')?.reset('');
          this.myForm.get('numero')?.reset('');
          
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
