import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { debounceTime, map, Observable, startWith } from 'rxjs';
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { Article_Chapter, Article_Section, Article_Title } from 'src/app/shared/interfaces/article-interface';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-edit-section',
  templateUrl: './edit-section.component.html',
  styleUrls: ['./edit-section.component.scss']
})
export class EditSectionComponent implements OnInit {

  /*Sections Control */
  myControlSections= new FormControl();
  optionsSections: Documents[] = [];
  filteredSectionsOptions: Observable<Documents[]> | undefined;

    /*Documents Control */
  myControlDocuments= new FormControl();
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;
  
  /*Title Control */
  myControlTitles= new FormControl();
  optionsTitles: Article_Title[] = [];
  filteredTitOptions: Observable<Article_Title[]> | undefined;

  /*Chapter Control */
  myControlChapters= new FormControl();
  optionsChapters: Article_Chapter[] = [];
  filteredChaOptions: Observable<Article_Chapter[]> | undefined;

  /*Name Control */
  myControlName = new FormControl('');
  name: string | undefined;

  showMain = true;
  showSpinner = false;

  /*Snackbar */
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  selectedDocument: number = 0;
  selectedSection: number = 0;
  selectedTitle:number = 0;
  selectedChapter:number = 0;
  sendingData: Article_Section = {
    id:0, nombre:"", id_documento:0, id_titulo:0, id_capitulo:0
  }


constructor(public apiService: ApiService, public snackBar: MatSnackBar) { 
    this.apiService.getDocuments()
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true;this.showSpinner = false;
        this.optionsDocuments = response.result;
      },
      error: err => { this.errorHandling(err);}
    });
 
  }

  getSections(){
    this.showSpinner= true
    this.showMain = false
    this.apiService.getSections()
    .subscribe({
      next: response => {
        this.showSpinner = false
        this.showMain = true
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true; this.showSpinner = false;
        this.optionsSections = response.result;
      },
      error: err => { this.errorHandling(err);}
    });
  }

  ngOnInit(): void {
    this.getSections()
    this.filteredDocOptions = this.myControlDocuments.valueChanges.pipe(
      startWith(''),debounceTime(300),
      map(value => {
        const title = typeof value === 'string' ? value : value?.titulo;
        return title ? this._filterDoc(title as string) : this.optionsDocuments.slice();
      }),
    );
    this.filteredSectionsOptions = this.myControlSections.valueChanges.pipe(
      startWith(''),debounceTime(300),
      map(value => {
        const title = typeof value === 'string' ? value : value?.titulo;
        return title ? this._filterDoc(title as string) : this.optionsSections.slice();
      }),
    );
    this.myControlTitles.disable()
    this.myControlChapters.disable()
  }

  /*Document Control Functions */
  private _filterDoc(doc: string): Documents[] {
    return this.optionsDocuments.filter(option => option.titulo?.toLowerCase().includes(doc.toLowerCase()));
  }
  
  displayDocument(doc: Documents): string {
    return doc && doc.titulo ? doc.titulo : '';
  }

  displaySection(sect): string {
    return sect && sect.nombre ? sect.nombre : '';
  }

  selectedDoc(opt: MatAutocompleteSelectedEvent) {
    this.myControlTitles.reset();
    this.selectedDocument = opt.option.value.id_documento;
    this.sendingData.id_documento = opt.option.value.id;
    this.getTitles(opt.option.value.id);
  }


  selectedSect(opt: MatAutocompleteSelectedEvent) {
    console.log(opt.option.value.id_capitulo)
    this.name = opt.option.value.nombre
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
    if(opt.option.value.id_capitulo !== null){
      this.apiService.getAllChapters(opt.option.value.id_capitulom,new HttpParams().set("id",opt.option.value.id_capitulo))
      .subscribe({
        next: (res) => {
          let chapterName = JSON.parse(this.apiService.decrypt(res.message, "private"))
          this.myControlChapters.setValue(chapterName.result[0])
          this.sendingData.id_capitulo = chapterName.result[0].id
        }
      })
    }
    this.myControlTitles.reset();
    this.selectedSection = opt.option.value.id;
    this.sendingData.id_documento = opt.option.value.id;
    this.getTitles(opt.option.value.id);
  }

  getTitles(id_documento:number){
    this.myControlTitles.disable();
    this.optionsTitles = [];
    this.filteredTitOptions = undefined
    this.apiService
    .getAllArticles(this.apiService.models.articulo_titulos,new HttpParams().set("id_documento",id_documento))
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true;this.showSpinner = false;
        this.optionsTitles = response.result;
        this.filteredTitOptions = this.myControlTitles.valueChanges.pipe(
          startWith(''),debounceTime(300),
          map(value => {
            const name = typeof value === 'string' ? value : value?.nombre;
            return name ? this._filterTit(name as string) : this.optionsTitles.slice();
          }),
        );
        this.myControlTitles.enable();
      },
      error: er => {
        this.showMain = true;
        this.showSpinner = false;
        if(er.status != 400)
          this.snackBar.open('Error al cargar los titulos', '', this.config_snack);
        else
          this.getChapters(id_documento)
      },
    });
  }

  handleEmptyDoc(event: any) {
    if(event.target.value === '') {
    }
  }

  /*Title Control Functions */
  private _filterTit(tit: string): Article_Title[] {
    return this.optionsTitles.filter(option => option.nombre?.toLowerCase().includes(tit.toLowerCase()));
  }
  
  displayTitle(tit: Article_Title): string {
    return tit && tit.nombre ? tit.nombre : '';
  }

  selectedTit(opt: MatAutocompleteSelectedEvent) {
    this.myControlChapters.reset();
    this.selectedTitle = opt.option.value.id;
    this.sendingData.id_titulo = opt.option.value.id;
    this.getChapters(0,opt.option.value.id)
  }

  getChapters(id_documento:number,id_titulo:number=0){
    this.myControlChapters.disable();
    this.optionsChapters = [];
    this.filteredChaOptions = undefined
    let httpParams = new HttpParams();
    if(id_documento) httpParams = httpParams.set("id_documento",id_documento)
    if(id_titulo) httpParams = httpParams.set("id_titulo",id_titulo)
    this.apiService
    .getAllArticles(this.apiService.models.articulo_capitulos,httpParams)
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response)
        this.showMain = true;this.showSpinner = false;
        this.optionsChapters = response.result;
        this.filteredChaOptions = this.myControlChapters.valueChanges.pipe(
          startWith(''),debounceTime(300),
          map(value => {
            const name = typeof value === 'string' ? value : value?.nombre;
            return name ? this._filterCha(name as string) : this.optionsChapters.slice();
          }),
        );
        this.myControlChapters.enable();
      },
      error: err => { this.errorHandling(err);}
    });
  }

  handleEmptyTit(event: any) {
    if(event.target.value === '') {}
  }

  /*Chapter Control Functions */
  private _filterCha(cha: string): Article_Chapter[] {
    return this.optionsChapters.filter(option => option.nombre?.toLowerCase().includes(cha.toLowerCase()));
  }
  
  displayChapter(cha: Article_Chapter): string {
    return cha && cha.nombre ? cha.nombre : '';
  }

  selectedCha(opt: MatAutocompleteSelectedEvent) {
    this.selectedChapter = opt.option.value.id;
    this.sendingData.id_capitulo = opt.option.value.id;
  }

  handleEmptyCha(event: any) {
    if(event.target.value === '') {}
  }

  /*Form to Save Functions*/

  checkValues() {
    return !(this.selectedSection !== 0 && this.selectedSection !== undefined && this.myControlName.valid)
  }

  saveAssignation() {
    this.showSpinner = true;
    this.sendingData.nombre = this.name || ""
    this.apiService.saveSection(this.sendingData)
    .subscribe({
      next: () => {
        this.showSpinner = false;
        this.snackBar.open('Seccion guardada correctamente', '', this.config_snack);
        this.resetFields();
      },
      error: err => {
        this.showSpinner = false;
        this.snackBar.open("Error: " + JSON.stringify(err.error.message), '', this.config_snack);
        console.log(JSON.stringify(err.error.message))
        this.resetFields();
      }
    });
  }

  resetFields() {
    this.myControlDocuments.reset();
    this.selectedDocument = 0;
    this.myControlTitles.reset();
    this.selectedTitle = 0;
    this.myControlChapters.reset();
    this.myControlSections.reset();
    this.selectedChapter = 0;
    this.sendingData = {id_titulo:0,id_capitulo:0,id_documento:0,id:0,nombre:""}
    this.name = "";
  }

  errorHandling(err: any) {
    if(err.status != 400){
      this.showMain = true;
      this.showSpinner = false;
      this.snackBar.open('Error al cargar los Documentos', '', this.config_snack);
    }
    console.log(err);
  }


  editSection(){
    this.showSpinner= true
    const body = {
      id: this.selectedSection,
      nombre: this.name,
      id_capitulo: this.sendingData.id_capitulo,
      id_titulo: this.sendingData.id_titulo,
      id_documento: this.sendingData.id_documento,
    }
    console.log(body)
    
    this.apiService.editSection({data:body}).subscribe({
      next: res =>{
        this.getSections()
        this.showSpinner= false
        this.snackBar.open('Seccion actualizada!', '', {
          duration:3000,
          verticalPosition:this.verticalPosition
        }) 
        this.resetFields();  
      },
      error: err => {
        this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
          duration:3000,
          verticalPosition:this.verticalPosition
        })        
        this.resetFields(); 
      }
    })
  }

  deleteSection() {
    if (this.selectedSection) {
      let body = {
        id: this.selectedSection,
        estatus: 0
      }
      console.log(body)
      this.apiService.editSection({data:body}).subscribe({
        next: response => {
          this.snackBar.open('Sección eliminada!', '', {
            duration:3000,
            verticalPosition:this.verticalPosition
          })       
          this.getSections()
          this.resetFields(); 
        },
        error: err => {
          console.log(JSON.stringify(err.error.message))
          this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
            duration:3000,
            verticalPosition:this.verticalPosition
          })        
          this.resetFields(); 
        }
      });
    }else{
      this.snackBar.open('Debes seleccionar una sección', '', {
        duration:3000,
        verticalPosition:this.verticalPosition
      })        
    }
  }

}
