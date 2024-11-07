import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css']
})
export class AddSectionComponent implements OnInit {
  title = "Agregar Sección de Documento";
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  myForm: FormGroup;
  leyes = [];
  libros = []; 
  titulos = [];
  capitulos = []

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      ley: ['', Validators.required],
      conservarLey:[false],
      libro: [{value:'', disabled:true}], // Opcional
      conservarLibro:[false],
      titulo: [{value:'', disabled:true}], // Opcional
      conservarTitulo:[false],
      capitulo: [{value:'', disabled:true}, Validators.required],
      conservarCapitulo:[false],
      nombre: [{value:'', disabled:true}, Validators.required],
      numero: [{value:'', disabled:true}, [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    this.myForm.get('ley')?.valueChanges.subscribe(value => {
      if (value) {
        this.myForm.get('libro')?.enable()
        this.myForm.get('titulo')?.enable()
        this.myForm.get('capitulo')?.enable()
        this.fetchBooks(value); // Solo se ejecuta si hay un valor de ley seleccionado
        this.fetchTitles(value)
        this.fetchChapters(value)
      } else {
        this.myForm.get('libro')?.disable()
        this.myForm.get('titulo')?.disable()
        this.myForm.get('capitulo')?.disable()
      }
    });

    this.myForm.get('libro')?.valueChanges.subscribe(value => {
      if (value) {
        console.log('entro en libro')
        this.fetchTitles(null, value)
        //this.fetchChapters(null, value)
      }
    });

    this.myForm.get('titulo')?.valueChanges.subscribe(value => {
      if (value) {
        console.log('entro en titulo')
        this.fetchChapters(null, null, value)
      }
    });

    this.myForm.get('capitulo')?.valueChanges.subscribe(value => {
      if(value) {
        this.myForm.get('nombre')?.enable()
        this.myForm.get('numero')?.enable()
      } else {
        this.myForm.get('nombre')?.disable()
        this.myForm.get('numero')?.disable()
      }
    })

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

  fetchTitles(lawId?:string, bookId?:string) {
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

  fetchChapters(lawId?:string, bookId?:string, titleId?:string) {
    let params = ''
    if(bookId) {
      params = `?bookId=${bookId}`
    } else if (titleId){
      params = `?titleId=${titleId}`
    } else {
      params = `?lawId=${lawId}`
    }

    this.apiService.fetchChapters(params).subscribe({
      next:res => {
        this.capitulos = res
      }, error: err => {
        console.error(err)
        this.snackBar.open('Ocurrió un erro al recuperar los capítulos', '', { 
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
        chapterId:values.capitulo.toString(),
      }

      this.apiService.addSection(body).subscribe({
        next: res => {
          if (!values.conservarLey) {
            this.myForm.get('ley')?.reset('');
            this.myForm.get('libro')?.reset('');
            this.myForm.get('titulo')?.reset('');
            this.myForm.get('capitulo')?.reset('');
          }
          if (!values.conservarLibro) {
            this.myForm.get('libro')?.reset('');
            this.myForm.get('titulo')?.reset('');
            this.myForm.get('capitulo')?.reset('');
          }
          if(!values.conservarTitulo) {
            this.myForm.get('titulo')?.reset('');
            this.myForm.get('capitulo')?.reset('');
          }
          if(!values.conservarCapitulo) {
            this.myForm.get('capitulo')?.reset('');
          }

          this.myForm.get('nombre')?.reset('');
          this.myForm.get('numero')?.reset('');
          
          // Deshabilitar inputs si no hay ley seleccionada
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
    }
  }
}