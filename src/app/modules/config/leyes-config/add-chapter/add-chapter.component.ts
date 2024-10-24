import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-chapter',
  templateUrl: './add-chapter.component.html',
  styleUrls: ['./add-chapter.component.css']
})
export class AddChapterComponent implements OnInit {
  title = "Agregar Capítulo de Documento";
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  myForm: FormGroup;
  leyes = [];
  libros = []; 
  titulos = [];
  libroHabilitado = false; // Controla si el combo de libro está habilitado
  tituloHabilitado = false;
  inputsHabilitados = false; // Controla si los inputs están habilitados
  conservarLey = false;
  conservarLibro = false;
  conservarTitulo = false;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      ley: ['', Validators.required],
      libro: [''], // Opcional
      titulo: [''], // Opcional
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
        this.fetchTitles(value)
      }
    });

    this.myForm.get('libro')?.valueChanges.subscribe(value => {
      if (value) {
        console.log('entro en libro')
        this.fetchTitles(null, value)
        //this.fetchChapters(null, value)
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

  fetchTitles(lawId:string, bookId?:string) {
    let params = ''
    if(bookId) {
      params = `?bookId=${bookId}`
    } else {
      params = `?lawId=${lawId}`
    }
    this.apiService.fetchTitles(params).subscribe({
      next:res => {
        this.titulos = res
      }, error: err => {
        console.error(err)
        this.snackBar.open('Ocurrió un erro al recuperar los títulos', '', { 
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
        titleId: values.titulo === '' ? null : values.titulo.toString()
      }

      console.log(body)

      if(body.titleId === null) {
        delete body.titleId
      } else {
        delete body.lawId
      }

      console.log(body)
      this.apiService.addChapter(body).subscribe({
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
          this.snackBar.open('Capítulo guardado correctamente', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }, error: err => {
          console.error(err)
          this.snackBar.open('Ocurrió un erro al guardar el capítulo', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }
      })


      // Limpiar campos
      
    }
  }

}
