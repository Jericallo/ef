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
  selector: 'dialog-template',
  templateUrl: './dialog-template.html',
  styleUrls:['./add-article.component.css'],
  styles: [' .arlet-new-container { width: 73vw; margin-right: 10px;}'],
})
export class DialogTemplate implements OnInit{

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

  optMay = 'Letras Mayusculas';
  optMis = 'Letras Minusculas';
  optNum = 'Numeros';
  optRom = 'Romanos';

  myControlMain =  new FormControl<string | Main>('');
  optionsMain: Main[] = [{main: this.optMay}, {main: this.optMis}, {main: this.optNum}, {main: this.optRom}];
  filteredMaiOptions: Observable<Main[]> | undefined;

  myControlLetter =  new FormControl<string | Letter>('');
  optionsLetter: Letter[] = [{lett: 'A'}, {lett: 'B'}, {lett: 'C'}, {lett: 'D'}, {lett: 'E'}, {lett: 'F'}, {lett: 'G'}, {lett: 'H'}, {lett: 'I'}, {lett: 'J'}, {lett: 'K'},
    {lett: 'L'}, {lett: 'M'}, {lett: 'N'}, {lett: 'O'}, {lett: 'P'}, {lett: 'Q'}, {lett: 'R'}, {lett: 'S'}, {lett: 'T'}, {lett: 'U'}, {lett: 'V'}, {lett: 'W'}, {lett: 'X'},
    {lett: 'Y'}, {lett: 'Z'}];
  filteredLetOptions: Observable<Letter[]> | undefined;

  myControlLetterMis =  new FormControl<string | Letter>('');
  optionsLetterMis: Letter[] = [{lett: 'a'}, {lett: 'b'}, {lett: 'c'}, {lett: 'd'}, {lett: 'e'}, {lett: 'f'}, {lett: 'g'}, {lett: 'h'}, {lett: 'i'}, {lett: 'j'}, {lett: 'k'},
    {lett: 'l'}, {lett: 'm'}, {lett: 'n'}, {lett: 'o'}, {lett: 'p'}, {lett: 'q'}, {lett: 'r'}, {lett: 's'}, {lett: 't'}, {lett: 'u'}, {lett: 'v'}, {lett: 'w'}, {lett: 'x'},
    {lett: 'y'}, {lett: 'z'}];
  filteredLetMisOptions: Observable<Letter[]> | undefined;

  myControlNumber =  new FormControl<string | Number>('');
  optionsNumber: Number[] = [{num: '1'}, {num: '2'}, {num: '3'}, {num: '4'}, {num: '5'}, {num: '6'}, {num: '7'}, {num: '8'}, {num: '9'}, {num: '10'}];
  filteredNumOptions: Observable<Number[]> | undefined;

  myControlNumberRom =  new FormControl<string | Number>('');
  optionsNumberRom: Number[] = [{num: 'I'}, {num: 'II'}, {num: 'III'}, {num: 'IV'}, {num: 'V'}, {num: 'VI'}, {num: 'VII'}, {num: 'VIII'}, {num: 'IX'}, {num: 'X'}];
  filteredNumRomOptions: Observable<Number[]> | undefined;

  myControlIndicator = new FormControl<string>('');
  myControlName = new FormControl<string>('');
  myControlOrder =  new FormControl<string | Number>('');
  filteredOrdOptions: Observable<Number[]> | undefined;
  myControlNumberP = new FormControl<string | Number>('');

  showMay = false;
  showMis = false;
  showNum = false;
  showRom = false;

  selectedLetter = null;
  selectedLetterMis = null;
  selectedNumber = null;
  selectedNumberRom = null;
  selectedMain = null;
  selectedOrder = null;
  
  htmlContentB = "";
  showEvents = false;
  isShownEvent = false;
  isShownComponent = false;
  showResults = false;

  type="0"
  indicator=""
  name=""
  number=""

  listOfArticles: ArticleRelation[] = [];

  constructor(public dialogRef: MatDialogRef<DialogTemplate>, @Inject(MAT_DIALOG_DATA) public data: any) {
    data != null ? this.editEvent(data) : '';
  }
  
  ngOnInit() {

    this.filteredMaiOptions = this.myControlMain.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.main;
        return name ? this._filterMai(name as string) : this.optionsMain.slice();
      }),
    );

    this.filteredLetOptions = this.myControlLetter.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.lett;
        return name ? this._filterLet(name as string) : this.optionsLetter.slice();
      }),
    );

    this.filteredLetMisOptions = this.myControlLetterMis.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.lett;
        return name ? this._filterLetMis(name as string) : this.optionsLetterMis.slice();
      }),
    );

    this.filteredNumOptions = this.myControlNumber.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.num;
        return name ? this._filterNum(name as string) : this.optionsNumber.slice();
      }),
    );

    this.filteredNumRomOptions = this.myControlNumberRom.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.num;
        return name ? this._filterNumRom(name as string) : this.optionsNumberRom.slice();
      }),
    );

    this.filteredOrdOptions = this.myControlNumber.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.num;
        return name ? this._filterNum(name as string) : this.optionsNumber.slice();
      }),
    );
  }

  selectedMai(opt: MatAutocompleteSelectedEvent){
    this.selectedMain = opt.option.value.main;
    console.log(this.selectedMain);

    switch (this.selectedMain ? this.selectedMain : '') {
      case this.optMay:
        this.showMay = true;
        this.showMis = false;
        this.selectedLetterMis = null;
        this.showNum = false;
        this.selectedNumber = null;
        this.showRom = false;
        this.selectedNumberRom = null;
        break;
      case this.optMis:
        this.showMis = true;
        this.showMay = false;
        this.selectedLetter = null;
        this.showNum = false;
        this.selectedNumber = null;
        this.showRom = false;
        this.selectedNumberRom = null;
        break;
      case this.optNum:
        this.showNum = true;
        this.showMay = false;
        this.selectedLetter = null;
        this.showMis = false;
        this.selectedLetterMis = null;
        this.showRom = false;
        this.selectedNumberRom = null;
        break;
      case this.optRom:
        this.showRom = true;
        this.showMay = false;
        this.selectedLetter = null;
        this.showMis = false;
        this.selectedLetterMis = null;
        this.showNum = false;
        this.selectedNumber = null;
        break;
      default:
        break;
    }
    //this.sendingArticle.indice_numerico = Number(opt.option.value.num);
  }

  selectedLet(opt: MatAutocompleteSelectedEvent){
    this.selectedLetter = opt.option.value.lett;
    //this.sendingArticle.indice_alfanumerico = opt.option.value.lett;
  }

  selectedLetMis(opt: MatAutocompleteSelectedEvent){
    this.selectedLetterMis = opt.option.value.lett;
    //this.sendingArticle.indice_alfanumerico = opt.option.value.lett;
  }

  selectedNum(opt: MatAutocompleteSelectedEvent){
    this.selectedNumber = opt.option.value.num;
    //this.sendingArticle.indice_numerico = Number(opt.option.value.num);
  }

  selectedNumRom(opt: MatAutocompleteSelectedEvent){
    this.selectedNumberRom = opt.option.value.num;
    //this.sendingArticle.indice_numerico = Number(opt.option.value.num);
  }

  selectedOrd(opt: MatAutocompleteSelectedEvent){
    this.selectedOrder = opt.option.value.num;
    //this.sendingArticle.indice_numerico = Number(opt.option.value.num);
  }

  private _filterMai(main: string): Main[] {
    const filterValueMain = main.toLowerCase();
    return this.optionsMain.filter(option => option.main ? option.main.toLowerCase().includes(filterValueMain) : '');
  }

  private _filterLet(letter: string): Letter[] {
    const filterValueLet = letter.toLowerCase();
    return this.optionsLetter.filter(option => option.lett.toLowerCase().includes(filterValueLet));
  }

  private _filterLetMis(letter: string): Letter[] {
    const filterValueLetMis = letter.toLowerCase();
    return this.optionsLetterMis.filter(option => option.lett.toLowerCase().includes(filterValueLetMis));
  }

  private _filterNum(num: string): Number[] {
    return this.optionsNumber.filter(option => option.num == num);
  }

  private _filterNumRom(num: string): Number[] {
    return this.optionsNumberRom.filter(option => option.num == num);
  }

  displayMain(ma: Main): string {
    return ma && ma.main ? ma.main : '';
  }

  displayLetter(le: Letter): string {
    return le && le.lett ? le.lett : '';
  }

  displayLetterMis(le: Letter): string {
    return le && le.lett ? le.lett : '';
  }

  displayNumber(nu: Number): string {
    return nu && nu.num ? nu.num : '';
  }

  displayNumberRom(nu: Number): string {
    return nu && nu.num ? nu.num : '';
  }

  displayOrder(nu: Number): string {
    return nu && nu.num ? nu.num : '';
  }

  handleEmptyMai(event: any){
    event.target.value === '' ? this.selectedMain = null : "";
  }

  handleEmptyLet(event: any){
    event.target.value === '' ? this.selectedLetter = null : "";
  }

  handleEmptyLetMis(event: any){
    event.target.value === '' ? this.selectedLetterMis = null : "";
  }

  handleEmptyNum(event: any){
    event.target.value === '' ? this.selectedNumber = null : "";
  }

  handleEmptyNumRom(event: any){
    event.target.value === '' ? this.selectedNumberRom = null : "";
  }

  handleEmptyOrd(event: any){
    event.target.value === '' ? this.selectedOrder = null : "";
  }

  checkValuesEvent() {
    return !(this.selectedOrder != null && this.htmlContentB)
  }

  addEvent() {
    const el: EventRelation = {
      id: isEditing ? editingId : -1,
      type: Number(this.type),
      ind: this.indicator,
      num: Number(this.number || "0"),
      order:this.selectedOrder,
      name: this.name,
      htmlCont: this.htmlContentB,
      ids_relacionados:this.listOfArticles.map((el: { id: number; }) => el.id)
    };
    this.dialogRef.close(el);
  }

  editEvent(item: EventRelation) {
    this.isShownEvent = true;
    isEditing = true;
    editingId = item.id;

    /*const main: Main = { main: item.type };
    this.selectedMain = item.type as any;
    this.myControlMain.setValue(main);

    const letter: Letter = { lett: item.lett ? item.lett : ''};
    this.selectedLetter = item.lett as any;
    if(letter.lett != '') {
      this.showMay = true;
      this.selectedLetterMis = null;
      this.selectedNumber = null;
      this.selectedNumberRom = null;
    }
    this.myControlLetter.setValue(letter);

    const letterMis: Letter = { lett: item.lettMis ? item.lettMis : '' };
    this.selectedLetterMis = item.lettMis as any;
    if(letterMis.lett != '') {
      this.showMis = true;
      this.selectedLetter = null;
      this.selectedNumber = null;
      this.selectedNumberRom = null;
    }
    this.myControlLetterMis.setValue(letterMis);

    const number: Number = { num: item.num ? item.num : '' };
    this.selectedNumber = item.num as any;
    if(number.num != '') {
      this.showNum = true;
      this.selectedLetterMis = null;
      this.selectedLetter = null;
      this.selectedNumberRom = null;
    }
   this.myControlNumber.setValue(number);

    const numberRom: Number = { num: item.numRom ? item.numRom : '' };
    this.selectedNumberRom = item.numRom as any;
    if(numberRom.num != '') {
      this.showRom = true;
      this.selectedLetter = null;
      this.selectedLetterMis = null;
      this.selectedNumber = null;
    }
    this.myControlNumberRom.setValue(numberRom);*/
    this.type = item.type.toString() || "0"
    this.selectedOrder = item.order as any
    this.myControlOrder.setValue({num: (item.order ? item.order?.toString() : "")})
    this.indicator = item.ind || ""
    this.number = item.num?.toString() || ""
    this.name = item.name || ""
    this.htmlContentB = item.htmlCont
  }

  resetFieldsEvent() {
    this.myControlMain.reset();
    this.myControlLetter.reset();
    this.myControlLetterMis.reset();
    this.myControlNumber.reset();
    this.myControlNumberRom.reset();
    this.htmlContentB = "";

    this.showMay = false;
    this.showMis = false;
    this.showNum = false;
    this.showRom = false;
    isEditing = false;
    editingId = -1;
  }

  closeModal() {
    this.dialogRef.close();
  }

  showSearchComponent() {
    if(this.isShownComponent == true){
      this.isShownComponent = false
    } else {
      this.isShownComponent = true
    }
  }

  artReceived(art: string[]) {
    art.length == 0 ? this.showResults = false : this.showResults = true;
    this.listOfArticles = Object.assign(art);
    //let id_relation = Object.assign(art).map((el: { id: number; }) => el.id);
    //this.sendingArticle.ids_relacionados = id_relation;
    //console.log(this.sendingArticle);
  }

  closePanel(close: boolean){
    close ? this.isShownComponent = false : this.isShownComponent = true;
  }

  changeRadio(event:MatRadioChange){
    if(event.value == 0){

    }else{

    }
  }

}

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
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
    this.myControlArticle.disable();
    this.filteredDocOptions = this.myControlDocuments.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.titulo;
        return name ? this._filterDoc(name as string) : this.optionsDocuments.slice();
      }),
    );

    this.filteredArtOptions = this.myControlArticle.valueChanges.pipe(
      startWith(''),
      map(value => this._filterArt(Number(value))),
    );

    this.myControlTitles.disable();
    this.myControlChapters.disable();
    this.myControlSections.disable();
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
    this.sendingArticle.articulo = opt.option.value;
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

  showEvent() {
    const dialogRef = this.dialog.open(DialogTemplate);

    /* Datos que regresan del Dialog */
    dialogRef.afterClosed().subscribe(result => {
      this.getResult(result);
    });

    this.isShownEvent == true ? this.isShownEvent = false : this.isShownEvent = true;
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

  saveArticle(){
    this.showSpinner = true;
    //this.sendingArticle.contenido = this.htmlContent;
    this.sendingArticle.nombre = this.name || ""
    this.sendingArticle.indicador = this.indicator || ""

    this.listOfEvents.forEach(el => {
      this.sendingArticle.parrafos?.push({
        indicador:el.ind, 
        orden:el.order,
        contenido:el.htmlCont, 
        tipo:el.type.toString(), 
        numero:el.num, 
        nombre:el.name, 
        id_articulo:0,
        relaciones:el.ids_relacionados
      })
    });

    this.apiService.saveArticle(this.sendingArticle)
    .subscribe({
      next: response => {
        console.log(response);
        this.showSpinner = false;
        this.snackBar.open('Articulo guardado correctamente', '', this.config_snack);
        this.resetFields();
        this.dataEvent.emit(1)
      },
      error: err => {
        this.showSpinner = false;
        this.snackBar.open("Error: " + JSON.stringify(err.error.message), '', this.config_snack);
      }
    });
  }

  editEvent(item: EventRelation) {
    const dialogRef = this.dialog.open(DialogTemplate, {
      data: item
    });

    /* Datos que regresan del Dialog */
    dialogRef.afterClosed().subscribe(result => {
      this.getResult(result);
    });
  }

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
}
