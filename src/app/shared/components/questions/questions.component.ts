import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatListOption } from '@angular/material/list';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ObligationsGet } from '../../interfaces/obligations-interface';
import { DocumentsService } from '../../services/documents.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export var isEditing = false;
export var editingId: number = -1;

export interface SaveAnswers {
    contenido: string | number,
    obligaciones: number[],
}

export interface SaveQuestion {
		preguntas:[{
			contenido: string,
			respuestas: SaveAnswers[]
		}]
}

export interface EventRelation {
  id: number,
  answer: string,
  obligations: ObligationsGet[],
}

@Component({
  selector: 'answer-template',
  templateUrl: './answer-template.html',
  styles: ['.artlet-container { width: 73vw; margin-right: 10px;}', '.search{ display: flex }', '.search-form { min-width: 150px; max-width: 500px; width: 100%; margin-right: 10px; }', '.search-full-width { width: 100% }', '.buttonSearch { margin-top: 5px !important; }', '.itemList { display: flex }'],
})
export class AnswerTemplate {
  myControlSearch = new FormControl('');

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

  htmlContentA = "";
  searchInput: string = "";
  showSpinner = false;
  showResults = false;
  showEvents = false;
  obligations: ObligationsGet[] = [];
  selectedOblOptions: Object[] = [];
  selectedOblOptionsEdited: Object[] = [];
  listOfObligations: ObligationsGet[] = [];

  title = "Respuesta";

  constructor(public getDocumentsService: DocumentsService, public dialogRef: MatDialogRef<AnswerTemplate>, @Inject(MAT_DIALOG_DATA) public data: any) {
    data != null ? this.editEvent(data) : '';
  }

  validateSearch(){
    this.showResults = false;
    this.showSpinner = true;
    this.getDocumentsService.searchObligations(this.searchInput)
    .subscribe({
      next: response => {
        this.showSpinner = false;
        this.showResults = true;
        this.obligations = response.result;

        //Busqueda personalizada, dependiendo las obligaciones ya relacionadas.
        if(this.listOfObligations.length > 0) {
          this.listOfObligations.filter(item => {
            this.obligations = this.obligations.filter(el => { 
              return item.id != el.id;
            });
          });
        }

      },
      error: err => {
        this.showSpinner = false;
        this.showResults = true;
        console.log("Error: ", err);
      }
    })
  }

  isActiveSearch(){
    if(this.searchInput != ""){
      return false;
    }else{
      return true;
    }
  }

  onChange(options: MatListOption[]) {
    const value = Object.assign(options.map(o => o.value));
    if(isEditing) {
      this.selectedOblOptions.forEach(el => {
        !this.selectedOblOptionsEdited.includes(el) ? this.selectedOblOptionsEdited.push(el) : '';
      });
      this.selectedOblOptionsEdited.push(value[0]);
    } else {
      this.selectedOblOptions = value;
    }
  }

  acceptSearch() {
    const data: EventRelation = {
      id: isEditing ? editingId : -1,
      obligations: isEditing ? this.selectedOblOptionsEdited : this.selectedOblOptions as any,
      answer: this.htmlContentA
    }
    this.dialogRef.close(data);
  }

  isActiveAccept() {
    if((this.selectedOblOptions.length > 0 && this.htmlContentA != "") || isEditing){
      return false;
    } else {
      return true
    }
  }

  editEvent(item: EventRelation) {
    console.log(item);
    isEditing = true;
    editingId = item.id;
    this.showEvents = true;
    this.htmlContentA = item.answer;
    this.listOfObligations = item.obligations;
    this.selectedOblOptions = Object.assign(item.obligations);
    this.selectedOblOptions.forEach(el => {
      this.selectedOblOptionsEdited.push(el);
    });
  }

  deleteEvent(itemDel: number) {
    console.log(itemDel);
    this.listOfObligations = this.listOfObligations.filter((item, index) => index !== itemDel);
    this.selectedOblOptionsEdited = this.selectedOblOptionsEdited.filter((item, index) => index !== itemDel);
    this.listOfObligations.length == 0 ? this.showEvents = false : this.showEvents = true;
  }

  closePanel() {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';

  htmlContentQ = "";
  showEvents = false;
  listOfEvents: EventRelation[] = [];
  showSpinner = false;

  title = "Agregar pregunta";

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

  constructor(public getDocumentsService: DocumentsService, public dialog: MatDialog, public snackBar: MatSnackBar,) { }

  ngOnInit(): void {
  }

  showAnswer() {
    const dialogRef = this.dialog.open(AnswerTemplate);
    /* Datos que regresan del Dialog */
    dialogRef.afterClosed().subscribe(result => {
      this.getResult(result);
    });
  }

  editEvent(item: EventRelation) {
    const dialogRef = this.dialog.open(AnswerTemplate, {
      data: item
    });

    /* Datos que regresan del Dialog */
    dialogRef.afterClosed().subscribe(result => {
      this.getResult(result);
    });
  }

  getResult(result: EventRelation){
    console.log(result);
    if(result != undefined){ 

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

  deleteEvent(itemDel: number) {
    this.listOfEvents = this.listOfEvents.filter((item, index) => index !== itemDel);
    this.listOfEvents.length == 0 ? this.showEvents = false : this.showEvents = true;
  }

  checkValues() {
    if(this.htmlContentQ != "" && this.listOfEvents.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  saveQuestion() {
    this.showSpinner = true;
    const getData: SaveAnswers = {
      contenido: "",
      obligaciones: []
    }

    const data: SaveQuestion = {
      preguntas: [{
        contenido: this.htmlContentQ,
        respuestas: [],
      }]
    }

    this.listOfEvents.forEach(el => {
      getData.obligaciones = [];
      getData.contenido = el.answer;
      el.obligations.forEach(ob => {
        getData.obligaciones.push(ob.id);
      });

      data.preguntas[0].respuestas.push({
        contenido: getData.contenido,
        obligaciones: getData.obligaciones
      });
    });

    this.getDocumentsService.saveQuestion(data)
    .subscribe({
      next: response =>{
        this.showSpinner = false;
        this.snackBar.open('Datos guardados correctamente', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.resetFields();
        console.log(response);
      },
      error: err => {
        this.showSpinner = false;
        this.snackBar.open('Error al guardar', '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
        this.resetFields();
        console.log(err);
      }
    });
  }

  resetFields() {
    this.htmlContentQ = "";
    this.listOfEvents = [];
    this.showEvents = false;
  }

}
