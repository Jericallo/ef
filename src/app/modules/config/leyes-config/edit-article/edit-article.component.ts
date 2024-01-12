import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { MatRadioChange } from '@angular/material/radio';
import { AngularEditorComponent,AngularEditorModule } from '@kolkov/angular-editor';
import { of } from 'rxjs';

//Services
import { ApiService } from 'src/app/shared/services/api.service';

//Interfaces
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import { Article, Article_Chapter, Article_Title, Article_Section } from 'src/app/shared/interfaces/article-interface';
import { ArticleRelation } from 'src/app/shared/interfaces/article-relation-interface';
export interface Main {
  main: string | null;
}

export interface Letter {
  lett: string;
}

export interface Number {
  num: string;
}

export interface EventRelation {
  id: number,
  type: number
  ind?:string | null,
  num?: number | null,
  order: number | null,
  name?: string | null,
  htmlCont: string,
  ids_relacionados?:number[]
}

export var isEditing = false;
export var editingId: number = -1;


@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.scss']
})
export class EditArticleComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<number>();

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '50px',
    maxHeight: '50px',
    width: '100%',
    minWidth: '0',
    translate: 'no',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Ingresa el texto',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    uploadUrl: 'v1/image',
    upload(file: File) {
      let a = null;
      return a as any; 
    },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
  };

   /*Article Control */
   myControlArticle2= new FormControl();
   optionsArticle2: any[] = [];
   filteredArticleOptions: Observable<number[]>;

  myControlDocuments = new FormControl<string | Documents>('');
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;

  myControlTitles = new FormControl<string | Article_Title>('');
  optionsTitles: Article_Title[] = [];
  filteredTitOptions: Observable<Article_Title[]> | undefined;

  myControlChapters = new FormControl<string | Article_Chapter>('');
  optionsChapters: Article_Chapter[] = [];
  filteredChaOptions: Observable<Article_Chapter[]> | undefined;

  myControlSections = new FormControl<string | Article_Section>('');
  optionsSections: Article_Section[] = [];
  filteredSecOptions: Observable<Article_Section[]> | undefined;

  myControlArticle =  new FormControl('');
  optionsArticle: number[] = [];
  filteredArtOptions!: Observable<number[]>;

  myControlName = new FormControl('');
  name: string | undefined;

  myControlIndicator = new FormControl('');
  indicator: string | undefined;

  listOfArticles: ArticleRelation[] = [];
  listOfEvents: EventRelation[] = [];

  htmlContent = "";
  htmlContentB = "";
  selectedDocument = null;
  selectedArticle = null;
  selectedLetter = null;
  selectedLetterMis = null;
  selectedNumber = null;
  selectedNumberRom = null;
  selectedMain = null;

  isShownComponent = false;
  isShownEvent = false;
  showSpinner = false;
  showMain = false;
  showResults = false;
  showEvents = false;

  showMay = false;
  showMis = false;
  showNum = false;
  showRom = false;

  showErrorArticle = false;
  maxDocs = -1;

  useDoc = false;
  useTit = false;
  useCap = false;
  useSec = false;

  articleId: any = 0;

  sendingArticle: Article = {
    id_documento: 0,
    id_titulo:0,
    id_capitulo:0,
    id_seccion:0,
    articulo: 0,
    indice_numerico: 0,
    indice_alfanumerico: "",
    nombre: "",
    parrafos: []
  };

  title = "Agregar articulo";

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private readonly cdRef: ChangeDetectorRef, public dialog: MatDialog) {
      this.apiService.updateGlobalTitle(this.title);
      this.showSpinner = true;
      this.apiService.getDocuments()
      .subscribe({
        next: response => {
          response = JSON.parse(this.apiService.decrypt(response.message,"private"));
          this.showMain = true;
          this.showSpinner = false;
          this.optionsDocuments = response.result;
        },
        error: er => {
          console.log(er);
          this.showMain = true;
          this.showSpinner = false;
          this.snackBar.open('Error al cargar los documentos', '', this.config_snack);
        },
        complete: () => {}
      });
  }
  ngOnInit() {
    this.getArticles()
    this.myControlArticle.disable();
    this.filteredDocOptions = this.myControlDocuments.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.titulo;
        return name ? this._filterDoc(name as string) : this.optionsDocuments.slice();
      }),
    );

    this.filteredArticleOptions = this.myControlArticle2.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filterArt2(name as string) : this.optionsArticle2.slice();
      }),
    );

    this.myControlTitles.disable();
    this.myControlChapters.disable();
    this.myControlSections.disable();
  }

  getArticles(){
    this.apiService.getAllArticles(this.apiService.models.articulos).subscribe({
      next: response => {    
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true; this.showSpinner = false;
        this.optionsArticle2 = response.result;
        console.log(this.optionsArticle2)
      }
    })
  }

  displayDocuments(obj: Documents): string {
    return obj && obj.titulo ? obj.titulo : '';
  }

  displayTitles(obj: Article_Title): string {
    return obj && obj.nombre ? obj.nombre : '';
  }

  displayChapters(obj: Article_Chapter): string {
    return obj && obj.nombre ? obj.nombre : '';
  }

  displaySections(obj: Article_Section): string {
    return obj && obj.nombre ? obj.nombre : '';
  }

  displayArticle2(obj: Article): string {
    return obj && obj.nombre ? obj.nombre : '';
  }


  selectedDoc(opt: MatAutocompleteSelectedEvent) {
    this.myControlArticle.enable()
    let array = [];
    for(let i = 1; i <= opt.option.value.num_articulos; i ++){
      array.push(i);
    }
    this.optionsArticle = array;
    this.selectedDocument = opt.option.value.titulo;
    this.maxDocs = opt.option.value.num_articulos;
    this.sendingArticle.id_documento = opt.option.value.id;
    this.cdRef.detectChanges();

    this.myControlTitles.reset();
    this.getTitles(opt.option.value.id)

    this.myControlChapters.enable();
    this.getChapters(opt.option.value.id);

    this.myControlSections.enable();
    this.getSections(opt.option.value.id)

  }

  selectedArt(opt: MatAutocompleteSelectedEvent) {
    this.selectedArticle = opt.option.value;
    this.articleId = opt.option.value.id;
    this.myControlArticle.setValue(opt.option.value.articulo)
    if(opt.option.value.indicador !== null){
      this.indicator = opt.option.value.indicador
    }
    if(opt.option.value.nombre !== null){
    this.name = opt.option.value.nombre
    }
    this.myControlArticle.setValue(opt.option.value.articulo)

    if(opt.option.value.id_documento !== null){
      this.apiService.getAllDocuments(opt.option.value.id_documento).subscribe({
        next: (res) => {
          let docName = JSON.parse(this.apiService.decrypt(res.message, "private"))
          console.log(docName)
          this.maxDocs = docName.result[0].num_articulos
          this.myControlDocuments.setValue(docName.result[0])
          this.selectedDocument = docName.result[0].titulo
          this.sendingArticle.id_documento = docName.result[0].id
          this.myControlTitles.enable()
          this.myControlArticle.enable()
        }     
      
      })
    }
    if(opt.option.value.id_titulo !== null){
      this.apiService.getAllArticles(this.apiService.models.articulo_titulos,new HttpParams().set("id",opt.option.value.id_titulo))
      .subscribe({
        next: (res) => {
          let titleName = JSON.parse(this.apiService.decrypt(res.message, "private"))
          this.myControlTitles.setValue(titleName.result[0])
          this.sendingArticle.id_titulo = titleName.result[0].id
          this.myControlChapters.enable()
        }
      })
    }
    if(opt.option.value.id_capitulo !== null){
      this.apiService.getAllChapters(opt.option.value.id_capitulo,new HttpParams().set("id",opt.option.value.id_capitulo))
      .subscribe({
        next: (res) => {
          let chapterName = JSON.parse(this.apiService.decrypt(res.message, "private"))
          this.myControlChapters.setValue(chapterName.result[0])
          this.sendingArticle.id_capitulo = chapterName.result[0].id
        }
      })
    }
    if(opt.option.value.id_seccion !== null){
      this.apiService.getAllSections(opt.option.value.id_seccion,new HttpParams().set("id",opt.option.value.id_seccion))
      .subscribe({
        next: (res) => {
          let sectName = JSON.parse(this.apiService.decrypt(res.message, "private"))
          this.myControlSections.setValue(sectName.result[0])
          this.sendingArticle.id_seccion = sectName.result[0].id
          this.myControlSections.enable()
        }
      })
    }
    this.sendingArticle.articulo = opt.option.value;
    console.log(this.sendingArticle.articulo)
  }

  selectedTit(opt: MatAutocompleteSelectedEvent) {
    //this.selectedArticle = opt.option.value;
    //this.sendingArticle.articulo = opt.option.value;
    this.sendingArticle.id_titulo = opt.option.value.id;
    this.getChapters(0,opt.option.value.id)
  }

  selectedCha(opt: MatAutocompleteSelectedEvent) {
    //this.selectedArticle = opt.option.value;
    //this.sendingArticle.articulo = opt.option.value;
    this.sendingArticle.id_capitulo = opt.option.value.id;
    this.getSections(this.sendingArticle.id_documento,this.sendingArticle.id_titulo || 0,opt.option.value.id)
  }

  selectedSec(opt: MatAutocompleteSelectedEvent){
    this.sendingArticle.id_seccion = opt.option.value.id
    //this.getSections(0, opt.option.value.id)
  }
  
  handleEmptyDoc(event: any){
    if(event.target.value === '') {
      this.selectedDocument = null;
      this.myControlArticle.disable();
      this.showErrorArticle = false;
    }
  }

  handleEmptyArt(event: any){
    event.target.value === '' ? this.selectedArticle = null : "";
    event.target.value > this.maxDocs || event.target.value <= 0 ? this.showErrorArticle = true : this.showErrorArticle = false;
  }

  handleEmptyTit(event: any){
    //event.target.value === '' ? this.selectedArticle = null : "";
    //event.target.value > this.maxDocs || event.target.value <= 0 ? this.showErrorArticle = true : this.showErrorArticle = false;
  }

  handleEmptyCha(event: any){
    //event.target.value === '' ? this.selectedArticle = null : "";
    //event.target.value > this.maxDocs || event.target.value <= 0 ? this.showErrorArticle = true : this.showErrorArticle = false;
  }

  handleEmptySec(event:any){}

  private _filterDoc(doc: string): Documents[] {
    const filterValueDoc = doc.toLowerCase();
    return this.optionsDocuments.filter(option => option.titulo.toLowerCase().includes(filterValueDoc));
  }

  private _filterArt(num: number) {
    return this.optionsArticle.filter(option => option == num);
  }


  private _filterArt2(doc: string): any[] {
    const filterValueDoc = doc.toLowerCase();
    console.log(filterValueDoc)
    return this.optionsArticle2.filter(option => option.nombre?.toLowerCase().includes(filterValueDoc));
  }

  /*
  private _filterArt2(name: string) {
    return this.optionsArticle2.filter(option => option == name);
  }
  */

  private _filterTit(tit: string): Article_Title[] {
    return this.optionsTitles.filter(option => option.nombre.toLowerCase().includes(tit.toLowerCase()));
  }

  private _filterCha(cha: string): Article_Chapter[] {
    return this.optionsChapters.filter(option => option.nombre.toLowerCase().includes(cha.toLowerCase()));
  }

  private _filterSec(sec: string): Article_Section[] {
    return this.optionsSections.filter(option => option.nombre.toLowerCase().includes(sec.toLowerCase()));
  }

  checkValues(){
    return !(this.selectedDocument !== null && this.selectedArticle !== null && this.name)
  }

  showSearchComponent() {
    this.isShownComponent == true ? this.isShownComponent = false : this.isShownComponent = true;
  }

  artReceived(art: string[]) {
    art.length == 0 ? this.showResults = false : this.showResults = true;
    this.listOfArticles = Object.assign(art);
    let id_relation = Object.assign(art).map((el: { id: number; }) => el.id);
    this.sendingArticle.ids_relacionados = id_relation;
    console.log(this.sendingArticle);
  }

  closePanel(close: boolean){
    close ? this.isShownComponent = false : this.isShownComponent = true;
  }

  deleteItem(itemDel: number) {
    this.listOfArticles = this.listOfArticles.filter((item, index) => index !== itemDel);
    this.listOfArticles.length == 0 ? this.showResults = false : this.showResults = true;
  }

  deleteEvent(itemDel: number) {
    this.listOfEvents = this.listOfEvents.filter((item, index) => index !== itemDel);
    this.listOfEvents.length == 0 ? this.showEvents = false : this.showEvents = true;
  }

  isArtActive() {
    if(this.selectedDocument !== null){
      return false;
    }else{
      return true;
    }
  }

  editArticle(){
    const body = {
        id: this.articleId,
        nombre: this.name,
        id_documento: this.sendingArticle.id_documento,
        id_titulo: this.sendingArticle.id_titulo,
        id_capitulo: this.sendingArticle.id_capitulo,
        id_seccion: this.sendingArticle.id_seccion,
        indicador: this.indicator
    }
    this.apiService.editArticle({data:body}).subscribe({
      next: res =>{
        this.getArticles()
        this.showSpinner= false
        this.snackBar.open('Articulo actualizado!', '', {
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
    })  }


  getResult(result: EventRelation) {
    if(result != undefined) {

      if(isEditing){
        isEditing = false;
        this.listOfEvents = this.listOfEvents.filter(item => item.id !== editingId);
      }

      let getMaxId;
      this.listOfEvents.length > 0 ? getMaxId = Math.max(...this.listOfEvents.map(el => el.id)) : getMaxId = 0;
      result.id = Number(getMaxId + 1);
      this.listOfEvents.push(result);
      this.showEvents = true;
    }
  }

  resetFields() {
    this.sendingArticle = {
      id_documento: this.useDoc ? this.sendingArticle.id_documento : 0,
      id_titulo:this.useTit ? this.sendingArticle.id_titulo:0,
      id_capitulo:this.useCap ? this.sendingArticle.id_capitulo : 0,
      id_seccion:this.useSec ? this.sendingArticle.id_seccion : 0,articulo: 0,nombre: "",parrafos: []};
    this.myControlArticle.reset();
    if(!this.useDoc)this.myControlDocuments.reset();
    if(!this.useTit)this.myControlTitles.reset();
    if(!this.useCap)this.myControlChapters.reset();
    if(!this.useSec)this.myControlSections.reset();
    this.listOfArticles = [];
    this.listOfEvents = [];
    this.name = "";
    this.indicator = ""
    this.myControlArticle2.reset()
    this.htmlContent = "";
    this.htmlContentB = "";
    this.showEvents = false;
  }

  getTitles(id_documento:number){
    this.myControlTitles.disable();
    this.optionsTitles = [];
    this.filteredTitOptions = undefined
    this.apiService.getAllArticles(this.apiService.models.articulo_titulos,new HttpParams().set("id_documento",id_documento))
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true;
        this.showSpinner = false;
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
      complete: () => {}
    })
  }

  getChapters(id_documento:number,id_titulo:number=0){
    this.myControlChapters.disable();
    this.optionsChapters = [];
    this.filteredChaOptions = undefined
    let httpParams = new HttpParams();
    if(id_documento) httpParams = httpParams.set("id_documento",id_documento)
    if(id_titulo) httpParams = httpParams.set("id_titulo",id_titulo)
    console.log(httpParams)
    this.apiService.getAllArticles(this.apiService.models.articulo_capitulos,httpParams)
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        console.log(response)
        this.showMain = true;
        this.showSpinner = false;
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
      error: er => {
        this.showMain = true;
        this.showSpinner = false;
        if(er.status != 400)
          this.snackBar.open('Error al cargar los capitulos', '', this.config_snack);
      },
      complete: () => {}
    })
  }

  getSections(id_documento:number,id_titulo:number=0, id_capitulo:number=0){
    this.myControlSections.disable();
    this.optionsSections = [];
    this.filteredSecOptions = undefined
    let httpParams = new HttpParams();
    if(id_documento) httpParams = httpParams.set("id_documento",id_documento)
    if(id_titulo) httpParams = httpParams.set("id_titulo",id_titulo)
    if(id_titulo) httpParams = httpParams.set("id_capitulo",id_capitulo)
    this.apiService.getAllArticles(this.apiService.models.articulo_secciones,httpParams)
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
        this.showMain = true;
        this.showSpinner = false;
        this.optionsSections = response.result;
        this.filteredSecOptions = this.myControlSections.valueChanges.pipe(
          startWith(''),debounceTime(300),
          map(value => {
            const name = typeof value === 'string' ? value : value?.nombre;
            return name ? this._filterSec(name as string) : this.optionsSections.slice();
          }),
        );
        this.myControlSections.enable();
      },
      error: er => {
        this.showMain = true;
        this.showSpinner = false;
        if(er.status != 400)
          this.snackBar.open('Error al cargar las secciones', '', this.config_snack);
      },
      complete: () => {}
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  deleteArticle() {
    if (this.selectedArticle) {
      let body = {
        id: this.articleId,
        estatus: 0
      }
      console.log(body)
      this.apiService.editArticle({data:body}).subscribe({
        next: response => {
          this.snackBar.open('Artículo eliminado!', '', {
            duration:3000,
            verticalPosition:this.verticalPosition
          })       
          this.getArticles()
          this.resetFields(); 
        },
        error: err => {
          this.snackBar.open('Error: ' + JSON.stringify(err.error.message), '', {
            duration:3000,
            verticalPosition:this.verticalPosition
          })        
          this.resetFields(); 
        }
      });
    }else{
      this.snackBar.open('Debes seleccionar un artículo', '', {
        duration:3000,
        verticalPosition:this.verticalPosition
      })        
    }
  }

}
