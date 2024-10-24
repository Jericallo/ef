import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'add-article',
  templateUrl: './add-article.component.html',
  styleUrls:['./add-article.component.css'],
  styles: [' .arlet-new-container { width: 73vw; margin-right: 10px;}'],
})
export class AddArticleComponent implements OnInit{
  title = "Agregar Sección de Documento";
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  myForm: FormGroup;
  leyes = [];
  libros = []; 
  titulos = [];
  capitulos = [];
  secciones = [];
  libroHabilitado = false; // Controla si el combo de libro está habilitado
  tituloHabilitado = false;
  capituloHabilitado = false;
  seccionHabilitado = false;
  inputsHabilitados = false; // Controla si los inputs están habilitados
  conservarLey = false;
  conservarLibro = false;
  conservarTitulo = false;
  conservarCapitulo = false;
  conservarSeccion = false;

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private fb: FormBuilder) { 
    this.myForm = this.fb.group({
      ley: ['', Validators.required],
      libro: [''], // Opcional
      titulo: [''], // Opcional
      capitulo: [''], //Opcional
      seccion: [''], //Opcional
      numero: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      subIndice: ['', [Validators.required]]
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
      }
    });

    this.myForm.get('capitulo')?.valueChanges.subscribe(value => {
      if (value) {
        this.fetchSections(null, null, null, value)
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
        baseNumber:values.numero.toString(),
        completeNumber:values.numero.toString() + values.subIndice.toString(),
        subIndex: values.subIndice.toString(),
        lawId:values.ley.toString(),
        titleId: values.titulo.toString(),
        chapterId: values.capitulo.toString(),
        sectionId: values.seccion.toString()
      }

      if(body.sectionId !== '') {delete body.lawId; delete body.titleId, delete body.chapterId}
      else if(body.chapterId !== '') {delete body.lawId; delete body.titleId, delete body.sectionId}
      else if(body.titleId !== '') {delete body.lawId; delete body.chapterId, delete body.chapterId}
      else {delete body.sectionId; delete body.titleId, delete body.chapterId}

      if(body.subIndex === '') delete body.subIndex 
      this.apiService.addArticle(body).subscribe({
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
          this.snackBar.open('Artículo guardado correctamente', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }, error: err => {
          console.error(err)
          this.snackBar.open('Ocurrió un erro al guardar el artículo', '', { 
            duration: 3000,
            verticalPosition: this.verticalPosition
          });
        }
      })      
    }
  }
}
