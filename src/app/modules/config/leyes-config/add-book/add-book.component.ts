import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss']
})
export class AddBookComponent implements OnInit {

  title = "Agregar Libro a la Ley";

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  myForm: FormGroup;
  leyes = [];
  inputsHabilitados = false;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      ley: ['', Validators.required],
      conservarLey:[false],
      nombre: [{value:'', disabled:true}, Validators.required,],
      numero: [{ value: '', disabled: true }, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    this.myForm.get('ley')?.valueChanges.subscribe(value => {
      if (value) {
        this.myForm.get('nombre')?.enable();
        this.myForm.get('numero')?.enable();
      } else {
        this.myForm.get('nombre')?.disable();
        this.myForm.get('numero')?.disable();
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

  onSubmit(): void {
    if (this.myForm.valid) {
      const values = this.myForm.value
      const body = {
        name: values.nombre.toString(),
        number:values.numero.toString(),
        lawId:values.ley.toString(),
      }

      this.apiService.addBook(body).subscribe({
        next: res => {
          this.myForm.get('nombre')?.reset('');
          this.myForm.get('numero')?.reset('');
          if(!values.conservarLey){
            this.myForm.get('ley')?.reset('')
          }

          this.snackBar.open('Libro guardado correctamente', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }, error: err => {
          console.error(err)
          this.snackBar.open('Ocurrió un erro al guardar el libro', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }
      })


      // Limpiar campos
      
    }
  }
}