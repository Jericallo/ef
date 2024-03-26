import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NavigationExtras, Router } from '@angular/router';
import { Capacitations } from 'src/app/shared/interfaces/capacitations-interface';
import { Questionnaire, QuestionnaireAnswers, QuestionnaireAnswersSave, QuestionnaireSave } from 'src/app/shared/interfaces/questionnaire-interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { DocumentsService } from 'src/app/shared/services/documents.service';
import { GlobalTitleService } from 'src/app/shared/services/global-title.service';

@Component({
  selector: 'app-questionarie',
  templateUrl: './questionarie.component.html',
  styleUrls: ['./questionarie.component.scss']
})
export class QuestionarieComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  showSpinner = false;
  questions: Questionnaire[] = [];
  questionsValidate = new Array;
  questionsLimitTime = 0

  questionsSave: QuestionnaireSave = {
    id_usuario: 2,
    id_capacitacion: 0,
    preguntas: []
  }

  title = "Cuestionario";

  constructor(public getDocumentsService: DocumentsService, public apiService: ApiService, public snackBar: MatSnackBar, private _router: Router, private globalTitle: GlobalTitleService) {
    this.globalTitle.updateGlobalTitle(this.title);
    const navigation = this._router.getCurrentNavigation();
    const state = navigation ? navigation.extras.state as Capacitations : undefined;
    

    if(sessionStorage.getItem('state')){
      const stateIds = JSON.parse(sessionStorage.getItem('state') || "");
      this.questionsSave.id_capacitacion = stateIds.id;
      this.questionsLimitTime = stateIds.tiempo_limite ? stateIds.tiempo_limite : 300;//defecto 5 minutos
    } else {
      this._router.navigate(['capacitaciones']);
    }
    this.showSpinner = true;
    this.apiService.getQuestionnaire(state ? state.id_video : 0)
    .subscribe({
      next: response => {
        response = JSON.parse(this.apiService.decrypt(response.message, "private"))
        console.log(response)
        this.showSpinner = false;
        this.questions = response.result.filter((el: Questionnaire) => el.respuestas != null);
        this.questionsValidate = this.questions;
      },
      error: err => {
        this.showSpinner = false;
        this.snackBar.open("Error al cargar Cuestionario", '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    });

  }

  ngOnInit() {
    this.startTiming()
  }

  selectedOpt(value: QuestionnaireAnswers) {
    const qa: QuestionnaireAnswersSave = {
      id_pregunta: value.id_pregunta,
      id_respuesta: value.id,
    }

    if(this.questionsSave.preguntas.length > 0) {
      const existing = this.questionsSave.preguntas.filter(el => el.id_pregunta === qa.id_pregunta);
      const indexToDelete = this.questionsSave.preguntas.indexOf(existing[0]);
      if(indexToDelete !== -1){
        this.questionsSave.preguntas.splice(indexToDelete, 1);
        this.questionsSave.preguntas.push(qa);
      } else {
        this.questionsSave.preguntas.push(qa);
      }
    } else {
      this.questionsSave.preguntas.push(qa);
    }
    
    console.log(this.questionsSave);
  }

  sendQuestionnaire() {
    this.showSpinner = true;
    this.apiService.saveQuestionnaire(this.questionsSave)
    .subscribe({
      next: response => {
        this.showSpinner = false;
        this.snackBar.open("Respuestas enviadas correctamente", '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });

        const navigationExtras: NavigationExtras = { state: response };
        this._router.navigate(['resultado'], navigationExtras);
      },
      error: err => {
        this.showSpinner = false;
        console.log(err);
        this.snackBar.open("Error: " + JSON.stringify(err.error.message), '', { 
          duration: 3000,
          verticalPosition: this.verticalPosition
        });
      }
    });
  }

  isSendDisabled() {
    if(this.questionsSave.preguntas.length == this.questionsValidate.length && this.limitTime > 0){
      return false;
    } else {
      return true;
    }
  }

  limitTime = 0
  idInterval:any = null;
  hoursToShow = "00";
  minutesToShow = "00";
  secondsToShow = "00";
  startTiming(){
    this.limitTime = this.questionsLimitTime;
    this.formatToLimitTime()
    this.idInterval = setInterval(() => {
      this.limitTime -= 1
      this.formatToLimitTime();
      if(this.limitTime < 0){
        this.limitTime = 0;
        clearInterval(this.idInterval);
        this.idInterval = null;
        this.sendQuestionnaire();
      }
    },1000);
  }

  formatToLimitTime(){
    if(this.limitTime >= 0){
      var date = new Date(this.limitTime * 1000)
      var hh = date.getUTCHours();
      var mm = date.getUTCMinutes();
      var ss = date.getUTCSeconds();
      this.hoursToShow = hh.toString().padStart(2,"0");
      this.minutesToShow = mm.toString().padStart(2,"0");
      this.secondsToShow = ss.toString().padStart(2,"0");
    }
  }

}
