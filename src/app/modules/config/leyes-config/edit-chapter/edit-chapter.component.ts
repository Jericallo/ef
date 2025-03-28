import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Article_Chapter, Article_Title } from 'src/app/shared/interfaces/article-interface';
import { FormControl } from '@angular/forms';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { of } from 'rxjs'; // Import 'of' from RxJS


@Component({
  selector: 'app-edit-chapter',
  templateUrl: './edit-chapter.component.html',
  styleUrls: ['./edit-chapter.component.scss']
})
export class EditChapterComponent implements OnInit {
  filteredChapters: Observable<any[]> | undefined;

  showMain = true;
  showSpinner = false;
  chapters: any[] = [];
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  selectedChapter = new FormControl();
  selectedChapterId: string = '';
  selectedDocument: string = '';
  name: string= '';
  document: string= '';
  title: string= '';

  myControlDocuments= new FormControl();
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;

  filteredTitOptions: Observable<Article_Title[]> | undefined;
  optionsTitles: Article_Title[] = [];
  selectedTitle:number = 0;
  myControlTitles= new FormControl();
  sendingData: Article_Chapter = {
    id:0, nombre:"", id_documento:0, id_titulo:0
  }

  constructor(private apiService: ApiService, public snackBar: MatSnackBar) {
    this.apiService.getDocuments().subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message, "private"));
        this.showMain = true;
        this.showSpinner = false;
        this.filteredDocOptions = of(response.result);       
      },
      error: err => {
        this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    });
  }

  ngOnInit(): void {
    this.getChapters();
  
    this.filteredChapters = this.selectedChapter.valueChanges.pipe(
      startWith(""),
      debounceTime(300),
      map(value => {
        const name = typeof value === "string" ? value : value?.nombre;
        return name ? this._filterChapt(name as string) : this.chapters.slice();
      })
    )
  }
  
  private _filterChapt(chapt: string): any[] {
    return this.chapters.filter(option => option.nombre?.toLowerCase().includes(chapt.toLowerCase()));
  }

  getChapters() {
    this.showSpinner = true;
    this.showMain = false;
    this.apiService.getAllSpecial("articulo_capitulo").subscribe({
      next: (response) => {
        const decryptedResponse = this.apiService.decrypt(response.message, "private");
        this.chapters = JSON.parse(decryptedResponse).result;
        console.log(this.chapters);  
        this.showSpinner = false;
        this.showMain = true;
      },
      error: (error) => {
        this.snackBar.open('Error: ' + JSON.stringify(error.error.message), '', {
          duration:3000,
          verticalPosition:this.verticalPosition
        })              
        this.showSpinner = false;
        this.showMain = true;
      },
    });
  }

  getTitles(id_document:number){
    this.myControlTitles.disable();
    this.optionsTitles = [];
    this.filteredTitOptions = undefined
    this.apiService
    .getAllArticles(this.apiService.models.articulo_titulos,new HttpParams().set("id_documento",id_document))
  .subscribe({
    next: response => {
      response = JSON.parse(this.apiService.decrypt(response.message,"private"));
      this.showMain = true;this.showSpinner = false;
      this.optionsTitles = response.result;
      console.log(this.optionsTitles)
      this.filteredTitOptions = this.myControlTitles.valueChanges.pipe(
        startWith(''),debounceTime(300),
        map(value => {
          const name = typeof value === 'string' ? value : value?.nombre;
          return name ? this._filterTit(name as string) : this.optionsTitles.slice();
        }),
      );
      this.myControlTitles.enable();
    },
    error: err => { 
      console.log(err)
    }
  });
  }

  private _filterTit(tit: string): Article_Title[] {
    return this.optionsTitles.filter(option => option.nombre?.toLowerCase().includes(tit.toLowerCase()));
  }

  displayDocument(doc: Documents): string {
    return doc && doc.titulo ? doc.titulo : '';
  }

  displayChapter(chapter): string {
    console.log(chapter)
    return chapter && chapter.nombre ? chapter.nombre : '';
  }

  displayTitle(tit: Article_Title): string {
    return tit && tit.nombre ? tit.nombre : '';
  }
  
  selectedChapt(opt: MatAutocompleteSelectedEvent) {
    console.log(opt)
    if(opt.option.value.id_documento !== null){
    this.apiService.getAllDocuments(opt.option.value.id_documento).subscribe({
      next: (res) => {
        let docName = JSON.parse(this.apiService.decrypt(res.message, "private"))
        this.myControlDocuments.setValue(docName.result[0])
        this.sendingData.id_documento = docName.result[0].id
      }
    })
  }
    if(opt.option.value.id_titulo !== null){
      this.apiService.getAllArticles(this.apiService.models.articulo_titulos,new HttpParams().set("id",opt.option.value.id_titulo))
      .subscribe({
        next: (res) => {
          let titleName = JSON.parse(this.apiService.decrypt(res.message, "private"))
          this.myControlTitles.setValue(titleName.result[0])
          this.sendingData.id_titulo = titleName.result[0].id
        }
      })
    }
    this.name = opt.option.value.nombre
    this.myControlTitles.reset();
    this.selectedChapterId = opt.option.value.id;
    //this.getTitles(opt.option.value.id);
  }
  
  selectedDoc(opt: MatAutocompleteSelectedEvent) {
    console.log(opt)
    this.myControlTitles.reset();
    this.selectedDocument = opt.option.value.id;
    this.sendingData.id_documento = opt.option.value.id;
    this.getTitles(opt.option.value.id);
  }

  selectedTit(opt: MatAutocompleteSelectedEvent) {
    this.selectedTitle = opt.option.value.id;
    this.sendingData.id_titulo = opt.option.value.id;
  }

  handleEmptyDoc(event: any) {
    if(event.target.value === '') {
    }
  }


  editChapter(){
    const body = {
      id: this.selectedChapterId,
      nombre: this.name,
      id_documento: this.sendingData.id_documento,
      id_titulo: this.sendingData.id_titulo
    }
    console.log(body)
    this.apiService.editChapter({data:body}).subscribe({
      next: res =>{
        this.snackBar.open('Capítulo actualizado!', '', {
          duration:3000,
          verticalPosition:this.verticalPosition
        }) 
        this.resetInputs();  
        this.getChapters()
      
      },
      error: err => {
        this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
          duration:3000,
          verticalPosition:this.verticalPosition
        })        
        this.resetInputs(); 
      }
    })
  }

  deleteChapter() {
    if (this.selectedChapterId) {
      let body = {
        id: this.selectedChapterId,
        estatus: 0
      }
      console.log(body)
      this.apiService.editChapter({data:body}).subscribe({
        next: response => {
          this.snackBar.open('Capítulo eliminado!', '', {
            duration:3000,
            verticalPosition:this.verticalPosition
          })       
          this.getChapters()
          this.resetInputs(); 
        },
        error: err => {
          this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
            duration:3000,
            verticalPosition:this.verticalPosition
          })        
          this.resetInputs(); 
        }
      });
    }else{
      this.snackBar.open('Debes seleccionar una clasificación', '', {
        duration:3000,
        verticalPosition:this.verticalPosition
      })        
    }
  }

  checkValues(){
    return !(this.selectedChapt !== null && this.selectedDocument !== null && this.name)
  }

  resetInputs() {
    this.selectedChapter.reset()
    this.myControlDocuments.reset()
    this.myControlTitles.reset()
    this.selectedDocument = null;
    this.name = ''
  }

}