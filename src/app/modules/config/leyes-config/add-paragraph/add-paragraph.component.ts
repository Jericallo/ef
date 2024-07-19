import { Component, OnInit, Inject, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
//import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { MatRadioChange } from '@angular/material/radio';
import { AngularEditorComponent,AngularEditorModule } from '@kolkov/angular-editor';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { of } from 'rxjs';
import { Paragraph } from 'src/app/shared/interfaces/paragraph-interface';

//Services
import { ApiService } from 'src/app/shared/services/api.service';

//Interfaces
import { Documents } from 'src/app/shared/interfaces/documents-interface';
import { Article, Article_Chapter, Article_Title, Article_Section, Article_Parrafo } from 'src/app/shared/interfaces/article-interface';
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
  selector: 'app-add-paragraph',
  templateUrl: './add-paragraph.component.html',
  styleUrls: ['./add-paragraph.component.css']
})
export class AddParagraphComponent implements OnInit {
  @Output() dataEvent = new EventEmitter<number>();

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '100px',
    maxHeight: '100px',
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

  title = "Agregar Parrafo/Fracción";
  showSpinner = false;
  showMain = false;
  isShownComponent = false;
  indicator="";
  selectedDocument = null;
  maxArticles = -1;

  listOfArticles: ArticleRelation[] = [];

  type="0"
  number=""
  selectedOrder = null;

  useDoc = false;
  useTit = false;
  useCap = false;
  useSec = false;

  nombre=""
  orden=0
  id_articulo=0
  contenido=""
  tipo=0
  indicador=""
  numero=0
  relaciones=[]

  paramsDoc=''
  paramsTit=''
  paramsCap=''
  paramsSec=''

  selectedArticle: number = 0;
  sendingData: Article = {
    id:0, 
    nombre:"", 
    id_documento:0,
    articulo:0,
  }

  sendingParagraph: Paragraph = {
    indicador: "",
    orden: 0,
    id_articulo: 0,
    contenido: "",
    tipo: "",
    numero: 0,
    nombre: "",
    relaciones:[]
  };

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

  htmlContentB = "";
  showResults = false;

  showErrorArticle = false;
  maxDocs = -1;

  filteredOrdOptions: Observable<Number[]> | undefined;
  myControlOrder =  new FormControl<string | Number>('');

  myControlChapters = new FormControl<string | Article_Chapter>('');
  optionsChapters: Article_Chapter[] = [];
  filteredChaOptions: Observable<Article_Chapter[]> | undefined;

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  myControlArticle =  new FormControl('');
  optionsArticle: number[] = [];
  filteredArtOptions!: Observable<number[]>;

  myControlNumber =  new FormControl<string | Number>('');
  optionsNumber: Number[] = [{num: '1'}, {num: '2'}, {num: '3'}, {num: '4'}, {num: '5'}, {num: '6'}, {num: '7'}, {num: '8'}, {num: '9'}, {num: '10'}];
  filteredNumOptions: any[] = [];

  myControlNumberRom =  new FormControl<string | Number>('');
  optionsNumberRom: Number[] = [{num: 'I'}, {num: 'II'}, {num: 'III'}, {num: 'IV'}, {num: 'V'}, {num: 'VI'}, {num: 'VII'}, {num: 'VIII'}, {num: 'IX'}, {num: 'X'}];
  filteredNumRomOptions: Observable<Number[]> | undefined;

  myControlSections = new FormControl<string | Article_Section>('');
  optionsSections: Article_Section[] = [];
  filteredSecOptions: Observable<Article_Section[]> | undefined;

  myControlTitles = new FormControl<string | Article_Title>('');
  optionsTitles: Article_Title[] = [];
  filteredTitOptions: Observable<Article_Title[]> | undefined;

  myControlDocuments = new FormControl<string | Documents>('');
  optionsDocuments: Documents[] = [];
  filteredDocOptions: Observable<Documents[]> | undefined;

  private _filterNum(num: string): Number[] {
    return this.optionsNumber.filter(option => option.num == num);
  }

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, private readonly cdRef: ChangeDetectorRef, public dialog: MatDialog,
    private globalTitle: ApiService) {
      this.globalTitle.updateGlobalTitle(this.title);
      this.showSpinner = true;
      this.apiService.updateGlobalTitle(this.title);
      this.showSpinner = true;
      this.apiService.getDocuments()
      .subscribe({
        next: response => {
          response = JSON.parse(this.apiService.decrypt(response.message,"private"));
          this.showMain = true;
          this.showSpinner = false;
          this.optionsDocuments = response.result;
          console.log(this.optionsDocuments)
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

  ngOnInit(): void {

    this.filteredOrdOptions = this.myControlNumber.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.num;
        return name ? this._filterNum(name as string) : this.optionsNumber.slice();
      }),
    );

    this.filteredDocOptions = this.myControlDocuments.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.titulo;
        return name ? this._filterDoc(name as string) : this.optionsDocuments.slice();
      }),
    );

    this.myControlTitles.disable();
    this.myControlChapters.disable();
    this.myControlSections.disable();
    this.myControlArticle.disable();

  }

  /**
   * AUTOCOMPLETE FUNCTIONS
   */
  displayWith(obj:any){
    if(!obj) return '';
    if((obj as Documents).titulo !== 'undefined') return obj.titulo ? obj.titulo : '';
    else if((obj as Article_Title).nombre !== 'undefined') return obj.nombre ? obj.nombre : '';
    else if((obj as Article_Chapter).nombre !== 'undefined') return obj.nombre ? obj.nombre : '';
    else if((obj as Article_Section).nombre !== 'undefined') return obj.nombre ? obj.nombre : '';
    else if((obj as Article).nombre !== 'undefined') return obj.nombre ? obj.nombre : '';
    else return '';
  }

  /**
   * API REQUESTS
   */

  private getArticles() {
    this.optionsArticle = []
    this.filteredArtOptions = undefined
    this.apiService.getAllArticles(this.apiService.models.articulos,null,(this.paramsDoc+this.paramsTit+this.paramsCap+this.paramsSec))
      .subscribe({
        next: response => {
          response = JSON.parse(this.apiService.decrypt(response.message,"private"));
          console.log(response.result)
          this.showMain = true;
          this.showSpinner = false;
          this.optionsArticle = response.result
          this.filteredArtOptions = of(response.result)
          this.myControlArticle.enable();
        },
        error: er => {
          console.log(er);
          this.showMain = true;
          this.showSpinner = false;
          this.snackBar.open('Error loading articles', '', this.config_snack);},
        complete: () => {}
      });
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

  changeRadio(event:MatRadioChange){
    if(event.value == 0){

    }else{

    }
  }

  handleEmptyOrd(event: any){
    if(event.target.value === '') {
      this.selectedDocument = null;
    }
  }

  checkValues() {
    //console.log(this.id_articulo)
    return (this.id_articulo == 0 && this.nombre == '' )
  }

  displaySections(obj: Article_Section): string {
    return obj && obj.nombre ? obj.nombre : '';
  }

  handleEmptySec(event:any){}

  selectedOrd(opt: MatAutocompleteSelectedEvent){
    this.orden = opt.option.value.num
    this.selectedOrder = opt.option.value.num;
    //this.sendingArticle.indice_numerico = Number(opt.option.value.num);
  }

  displayOrder(nu: Number): string {
    console.log(nu)
    return nu.toString() && nu.toString() ? nu.toString() : '';
  }

  addEvent() {
    
    this.sendingParagraph.contenido = this.contenido
    this.sendingParagraph.id_articulo = this.id_articulo
    this.sendingParagraph.indicador = this.indicador
    this.sendingParagraph.nombre = this.nombre
    this.sendingParagraph.numero = this.numero
    this.sendingParagraph.orden = this.orden
    this.sendingParagraph.tipo = this.tipo.toString()
    this.sendingParagraph.relaciones = this.relaciones

    console.log(this.sendingParagraph)

    this.apiService.saveParagraph(this.sendingParagraph)
    .subscribe({
      next: response => {
        console.log(response);
        this.showSpinner = false;
        this.snackBar.open('Párrafo guardado correctamente', '', this.config_snack);
       
      },
      error: err => {
        this.showSpinner = false;
        console.log(err)
        this.snackBar.open("Error: " + JSON.stringify(this.apiService.decrypt(err.error.message)), '', this.config_snack);
      }
    });
  }

  selectedDoc(opt: MatAutocompleteSelectedEvent) {
    //this.selectedArticle = opt.option.value.id_articulo
    //this.id_articulo = opt.option.value.id_articulo
    console.log(opt.option.value)
    this.myControlArticle.enable()
    let array = [];
    for(let i = 1; i <= opt.option.value.num_articulos; i ++){
      array.push(i);
    }
    this.optionsArticle = array;
    this.selectedArticle = opt.option.value.titulo;
    this.maxArticles = opt.option.value.num_articulos;
    this.sendingParagraph.id_articulo = opt.option.value.id;
    this.cdRef.detectChanges();

    this.paramsDoc = '&id_documento=' + opt.option.value.id
    this.getArticles()
    this.getTitles(opt.option.value.id)
    this.myControlChapters.enable();
    this.myControlSections.enable();
    this.getChapters(opt.option.value.id)
    this.getSections(opt.option.value.id)
    this.myControlTitles.enable();
    
  }

  selectedArt(opt: MatAutocompleteSelectedEvent) {
    this.id_articulo = opt.option.value.id
  }

  displayArticle(art: Article_Parrafo): string {
    console.log(art)
    return art && art.nombre.toString() ? art.nombre.toString() : '';
  }
  
  handleEmptyArticle(event: any) {
    if(event.target.value === '') {
      //this.selectedObligations = [];
      //this.sendingData.id_regimen = null;
      //this.selectedRegime = 0;
    }
  }

  showSearchComponent() {
    if(this.isShownComponent == true){
      this.isShownComponent = false
    } else {
      this.isShownComponent = true
    }
  }

  artReceived(art: any[]) {
    art.length == 0 ? this.showResults = false : this.showResults = true;
    console.log(art)
    this.relaciones = Object.assign(art.map(obj => obj.id));
    console.log(this.relaciones)
    //let id_relation = Object.assign(art).map((el: { id: number; }) => el.id);
    //this.sendingArticle.ids_relacionados = id_relation;
    //console.log(this.sendingArticle);
  }

  closePanel(close: boolean){
    close ? this.isShownComponent = false : this.isShownComponent = true;
  }

  selectedSec(opt: MatAutocompleteSelectedEvent){
    this.sendingArticle.id_seccion = opt.option.value.id
    //this.getSections(0, opt.option.value.id)

    console.log(opt.option.value)
    this.paramsSec = '&id_seccion=' + opt.option.value.id
    this.getArticles()
  }

  selectedCha(opt: MatAutocompleteSelectedEvent) {
    //this.selectedArticle = opt.option.value;
    //this.sendingArticle.articulo = opt.option.value;
    this.sendingArticle.id_capitulo = opt.option.value.id;
    this.getSections(this.sendingArticle.id_documento,this.sendingArticle.id_titulo || 0,opt.option.value.id)
    console.log(opt.option.value)

    this.paramsDoc = '&id_capitulo=' + opt.option.value.id
    this.getArticles()
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

  private _filterSec(sec: string): Article_Section[] {
    return this.optionsSections.filter(option => option.nombre.toLowerCase().includes(sec.toLowerCase()));
  }

  private _filterTit(tit: string): Article_Title[] {
    return this.optionsTitles.filter(option => option.nombre.toLowerCase().includes(tit.toLowerCase()));
  }

  displayChapters(obj: Article_Chapter): string {
    return obj && obj.nombre ? obj.nombre : '';
  }

  handleEmptyCha(event: any){
    //event.target.value === '' ? this.selectedArticle = null : "";
    //event.target.value > this.maxDocs || event.target.value <= 0 ? this.showErrorArticle = true : this.showErrorArticle = false;
  }

  selectedTit(opt: MatAutocompleteSelectedEvent) {
    //this.selectedArticle = opt.option.value;
    //this.sendingArticle.articulo = opt.option.value;
    this.sendingArticle.id_titulo = opt.option.value.id;
    this.getChapters(0,opt.option.value.id)
    console.log(opt.option.value)
    this.paramsTit = '&id_titulo=' + opt.option.value.id
    this.getArticles()
    this.myControlChapters.enable();
  }

  getChapters(id_documento:number,id_titulo:number=0){
    this.myControlChapters.disable();
    this.optionsChapters = [];
    this.filteredChaOptions = undefined
    let httpParams = new HttpParams();
    if(id_documento) httpParams = httpParams.set("id_documento",id_documento)
    if(id_titulo) httpParams = httpParams.set("id_titulo",id_titulo)
    httpParams.set('model','articulo_capitulo')
    this.apiService.getAllArticles(this.apiService.models.articulo_capitulos,httpParams)
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message,"private"));
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
  

  private _filterCha(cha: string): Article_Chapter[] {
    return this.optionsChapters.filter(option => option.nombre.toLowerCase().includes(cha.toLowerCase()));
  }

  private _filterDoc(doc: string): Documents[] {
    const filterValueDoc = doc.toLowerCase();
    return this.optionsDocuments.filter(option => option.titulo.toLowerCase().includes(filterValueDoc));
  }

  displayDocuments(obj: Documents): string {
    return obj && obj.titulo ? obj.titulo : '';
  }

  displayTitles(obj: Article_Title): string {
    return obj && obj.nombre ? obj.nombre : '';
  }

  handleEmptyTit(event: any){
    //event.target.value === '' ? this.selectedArticle = null : "";
    //event.target.value > this.maxDocs || event.target.value <= 0 ? this.showErrorArticle = true : this.showErrorArticle = false;
  }

  handleEmptyDoc(event: any){
    if(event.target.value === '') {
      this.selectedDocument = null;
      this.showErrorArticle = false;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}


