import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-part',
  templateUrl: './add-part.component.html',
  styleUrls: ['./add-part.component.scss']
})
export class AddPartComponent implements OnInit {

  title = "Agregar Parte del artículo";
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  myForm: FormGroup;
  leyes = [];
  libros = []; 
  titulos = [];
  capitulos = [];
  secciones = [];
  articulos = [];
  libroHabilitado = false; // Controla si el combo de libro está habilitado
  tituloHabilitado = false;
  capituloHabilitado = false;
  seccionHabilitado = false;
  inputsHabilitados = false; // Controla si los inputs están habilitados
  articuloHabilitados = false
  conservarLey = false;
  conservarLibro = false;
  conservarTitulo = false;
  conservarCapitulo = false;
  conservarSeccion = false;
  conservarArticulo = false;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      ley: ['', Validators.required],
      libro: [''], // Opcional
      titulo: [''], // Opcional
      capitulo: [''], //Opcional
      seccion: [''], //Opcional
      articulo: ['', [Validators.required]], //Opcional
      letra: ['', [Validators.required]],
      contenido: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.myForm.get('ley')?.valueChanges.subscribe(value => {
      this.libroHabilitado = !!value; // Habilita el combo de libro si hay una ley seleccionada
      this.inputsHabilitados = !!value; // Habilita los inputs si hay una ley seleccionada
      if (value) {
        this.fetchBooks(value); // Solo se ejecuta si hay un valor de ley seleccionado
        this.fetchTitles(value)
        this.fetchChapters(value)
        this.fetchArticles(value)
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
        this.fetchChapters(null, null, value)
        this.fetchArticles(null, null, value)
      }
    });

    this.myForm.get('capitulo')?.valueChanges.subscribe(value => {
      if (value) {
        this.fetchSections(null, null, null, value)
        this.fetchArticles(null, null, null, value)
      }
    });

    this.myForm.get('seccion')?.valueChanges.subscribe(value => {
      if (value) {
        this.fetchArticles(null, null, null, null, value)
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

  fetchSections(lawId?:string, bookId?:string, titleId?:string, chapterId?:string) {
    let params = ''
    if(bookId) {
      params = `?bookId=${bookId}`
    } else if (titleId){
      params = `?titleId=${titleId}`
    } else if (chapterId) {
      params = `?chapterId=${chapterId}`
    } else {
      params = `?lawId=${lawId}`
    }

    this.apiService.fetchSections(params).subscribe({
      next:res => {
        this.secciones = res
      }, error: err => {
        console.error(err)
        this.snackBar.open('Ocurrió un erro al recuperar las secciones', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    })
  }

  fetchArticles = (lawId?:string, bookId?:string, titleId?:string, chapterId?:string, sectionId?:string) => {
    let params = ''
    if(bookId) {
      params = `?bookId=${bookId}`
    } else if (titleId){
      params = `?titleId=${titleId}`
    } else if (chapterId) {
      params = `?chapterId=${chapterId}`
    } else if (sectionId) {
      params = `?sectionId=${sectionId}`
    } else {
      params = `?lawId=${lawId}`
    }

    this.apiService.fetchArticle(params).subscribe({
      next: res => {
        this.articulos = res
      }, error: err => {
        console.error(err)
        this.snackBar.open('Ocurrió un erro al recuperar los artículos', '', { 
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
        letter:values.letra.toString(),
        content:values.contenido.toString(),
        articleId: values.articulo.toString(),
      }

      console.log(body)

      this.apiService.addPart(body).subscribe({
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
          this.snackBar.open('Parte guardada correctamente', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }, error: err => {
          console.error(err)
          this.snackBar.open('Ocurrió un erro al guardar la parte', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }
      })      
    }
  }
}
