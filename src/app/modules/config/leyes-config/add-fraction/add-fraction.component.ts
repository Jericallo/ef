import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-fraction',
  templateUrl: './add-fraction.component.html',
  styleUrls: ['./add-fraction.component.scss']
})
export class AddFractionComponent implements OnInit {

  title = "Agregar fracción del párrafo";
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  myForm: FormGroup;
  leyes = [];
  libros = []; 
  titulos = [];
  capitulos = [];
  secciones = [];
  articulos = [];
  partes = [];
  parrafos = []

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      ley: ['', Validators.required],
      conservarLey:[false],
      libro: [{value:'', disabled:true}], // Opcional
      conservarLibro:[false],
      titulo: [{value:'', disabled:true}], // Opcional
      conservarTitulo:[false],
      capitulo: [{value:'', disabled:true}], //Opcional
      conservarCapitulo:[false],
      seccion: [{value:'', disabled:true}], //Opcional
      conservarSeccion:[false],
      articulo: [{value:'', disabled:true}, [Validators.required]], //Opcional
      conservarArticulo:[false],
      parte: [{value:'', disabled:true}],
      conservarParte:[false],
      parrafo:[{value:'', disabled:true}, [Validators.required]],
      conservarParrafo:[false],
      numero: [{value:'', disabled:true}, [Validators.required, Validators.pattern('^[0-9]+$')]],
      romano:[{value:'', disabled:true}, [Validators.required, Validators.pattern('^(?=[MDCLXVI])M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$')]],
      contenido: [{value:'', disabled:true}, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.myForm.get('ley')?.valueChanges.subscribe(value => {
      if (value) {
        this.myForm.get('libro')?.enable()
        this.myForm.get('titulo')?.enable()
        this.myForm.get('capitulo')?.enable()
        this.myForm.get('articulo')?.enable()
        this.fetchBooks(value); // Solo se ejecuta si hay un valor de ley seleccionado
        this.fetchTitles(value)
        this.fetchChapters(value)
        this.fetchArticles(value)
      } else {
        this.myForm.get('libro')?.disable()
        this.myForm.get('titulo')?.disable()
        this.myForm.get('capitulo')?.disable()
        this.myForm.get('articulo')?.disable()
      }
    });

    this.myForm.get('libro')?.valueChanges.subscribe(value => {
      if (value) {
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
        this.myForm.get('seccion')?.enable()
        this.fetchSections(null, null, null, value)
        this.fetchArticles(null, null, null, value)
      } else {
        this.myForm.get('seccion')?.disable()
      }
    });

    this.myForm.get('seccion')?.valueChanges.subscribe(value => {
      if (value) {
        this.fetchArticles(null, null, null, null, value)
      }
    });

    this.myForm.get('articulo')?.valueChanges.subscribe(value => {
      if (value) {
        this.myForm.get('parte')?.enable()
        this.myForm.get('parrafo')?.enable()
        this.fetchParts(value)
        this.fetchParrafos(value)
      } else {
        this.myForm.get('parte')?.disable()
        this.myForm.get('parrafo')?.disable()
      }
    });

    this.myForm.get('parte')?.valueChanges.subscribe(value => {
      if (value) {
        this.fetchParrafos(null, value)
      }
    });

    this.myForm.get('parrafo')?.valueChanges.subscribe(value => {
      if(value) {
        this.myForm.get('numero').enable()
        this.myForm.get('romano').enable()
        this.myForm.get('contenido').enable()
      } else {
        this.myForm.get('numero').disable()
        this.myForm.get('romano').disable()
        this.myForm.get('contenido').disable()
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

  fetchParts = (articleId:string) => {
    const params = `?articleId=${articleId}`

    this.apiService.fetchPart(params).subscribe({
      next: res => {
        this.partes = res
      }, error: err => {
        console.error(err)
        this.snackBar.open('Ocurrió un erro al recuperar las partes', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    })
  }

  fetchParrafos = (articleId:string, partId?:string) => {
    let params = ''
    if(partId) {
      params = `?partId=${partId}`
    } else {
      params = `?articleId=${articleId}`
    }

    console.log(params)
    this.apiService.fetchParragraph(params).subscribe({
      next: res => {
        this.parrafos = res
      }, error: err => {
        console.error(err)
        this.snackBar.open('Ocurrió un erro al recuperar los párrafos', '', { 
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
        paragraphId:values.parrafo.toString(),
        content:values.contenido.toString(),
        arabicNumber: values.numero.toString(),
        romanNumber: values.romano.toString(),
        completeNumber: values.romano.toString() + values.numero.toString(),
      }

      console.log(body)

      this.apiService.addFraction(body).subscribe({
        next: res => {
          if (!values.conservarLey) {
            this.myForm.get('ley')?.reset('');
            this.myForm.get('libro')?.reset('');
            this.myForm.get('titulo')?.reset('');
            this.myForm.get('capitulo')?.reset('');
            this.myForm.get('seccion')?.reset('');
            this.myForm.get('articulo')?.reset('');
            this.myForm.get('parte')?.reset('');
          }
          if (!values.conservarLibro) {
            this.myForm.get('libro')?.reset('');
          }
          if (!values.conservarTitulo) {
            this.myForm.get('titulo')?.reset('');
          }
          if (!values.conservarCapitulo) {
            this.myForm.get('capitulo')?.reset('');
            this.myForm.get('seccion')?.reset('');
          }
          if (!values.conservarSeccion) {
            this.myForm.get('seccion')?.reset('');
          }
          if (!values.conservarArticulo) {
            this.myForm.get('articulo')?.reset('');
            this.myForm.get('parte')?.reset('');
            this.myForm.get('parrafo')?.reset('');
          }
          if (!values.conservarParte) {
            this.myForm.get('parte')?.reset('');
          }
          if (!values.conservarParrafo) {
            this.myForm.get('parrafo')?.reset('');
          }
          this.myForm.get('contenido')?.reset('');
          this.myForm.get('numero')?.reset('');
          this.myForm.get('romano')?.reset('');
          
          this.snackBar.open('Fracción guardada correctamente', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }, error: err => {
          console.error(err)
          this.snackBar.open('Ocurrió un erro al guardar la fracción', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }
      })      
    }
  }

}
