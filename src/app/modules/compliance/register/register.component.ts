import { ChangeDetectorRef, Component, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { RegisterTable } from 'src/app/shared/interfaces/register-table-interface';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }] 
})

export class RegisterComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}
  
  displayedColumns: string[] = [
    'number', 
    'name', 
    'first_period', 
    'second_period', 
    'third_period', 
    'fourth_period', 
    'outside_period', 
    'legal_founding', 
    'snitching_supervisor', 
    'evidence', 
    '1minute',
    '5minute',
    'exam_questions',
    'correct_answers',
    'exam_questions_five_minutes',
    'correct_answers_five_minutes',
    'incorrect_answers',
    'incomplete_sanctions'
  ];

  //VARIABLES FOR THE PERIODS
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public disabled = false;
  showSpinners = true;
  public showSeconds = true;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public touchUi = false;
  public enableMeridian = false;
  public color: ThemePalette = 'primary';
  public hideTime = false;
  public disableMinute = false;

  //VARIABLES FOR LAWS MODAL
  public isShownLawsModal = false

  //VARIABLES FOR DOCUMENTATIONS MODAL
  public isShownDocumentationsModal = false
  public sentDocumentations = null

  //VARIABLES FOR DOCUMENTATIONS
  public allDocumentations = []

  //VARIABLES FOR TRAININGS
  public oneMinuteTrainings = []
  public fiveMinuteTrainings = []
  public tenMinuteTrainings = []
  public fifteenMinuteTrainings = []

  //FUNDAMENTAL VARIABLES
  universalRow:RegisterTable
  dataSource: RegisterTable[] = [];

  constructor(private apiService: ApiService, public dialog: MatDialog, public snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {}

  //---------------------------------------UNIVERSAL FUNCTIONS--------------------------------------------//

  ngOnInit(): void {
    this.fetchObligations();
    this.fetchAllVideos()
    this.getDocumentations()
  }

  fetchObligations(): void {
    let date = new Date(), y = date.getFullYear(), m = date.getMonth();

    this.apiService.getAllObligations(m +1, y).subscribe({
      next: res => {
        console.log('REPSONSE',res)
        this.dataSource = res.obligations.map(obligation => {
          return {
            num: obligation.id,
            name: obligation.name,
            first_period: new Date(obligation.startPeriod) || null,
            second_period: new Date(obligation.firstPeriod) || null,
            third_period: new Date(obligation.secondPeriod) || null,
            fourth_period: new Date(obligation.thirdPeriod) || null,
            outside_period: new Date(obligation.fourthPeriod) || null,
            legal_founding: [],
            snitching_supervisor: new Date(obligation.supervisorWarning) || null,
            evidence: [],
            one_minute: obligation.oneMinVidAuthor,
            five_minute: obligation.fiveMinVidAuthor,
            exam_questions: null,
            correct_answers: null,
            exam_questions_five_minutes: null,
            correct_answers_five_minutes: null,
            incorrect_answers: null,
            incomplete_sanctions: obligation.sanction,
            trainings: obligation.trainings
          };
        });
        
        this.cdr.detectChanges(); // Forzar la detección de cambios
        console.log('FONTANA DU DATOS', this.dataSource);
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getDocumentations(): void {
    this.apiService.getAllDocumentations().subscribe({
      next: res => {
        this.allDocumentations = res
      }, error: err => {
        console.error(err)
      }
    })
  }

  fetchAllVideos():void {
    this.apiService.getTrainings('oneMin').subscribe({ next:res => { this.oneMinuteTrainings = res }, error: err => { console.error(err) }})
    this.apiService.getTrainings('fiveMin').subscribe({ next:res => { this.fiveMinuteTrainings = res }, error: err => { console.error(err) }})
    this.apiService.getTrainings('tenMin').subscribe({ next:res => { this.tenMinuteTrainings = res }, error: err => { console.error(err) }})
  }

  addObligation(): void {
    const today = new Date();
    
    today.setUTCHours(0, 0, 0, 0);
    const isoString = today.toISOString();
    const body = {
      name:'Nueva obligación',
      startPeriod: isoString,
      firstPeriod: isoString,
      secondPeriod: isoString,
      thirdPeriod: isoString,
      fourthPeriod: isoString,
      supervisorWarning: isoString,
      oneMinVidAuthor: 'No especificado',
      fiveMinVidAuthor: 'No especificado',
      sanction: 'No especificado'
    }
    console.log(body)
    this.apiService.addObligation(body).subscribe({
      next: res => {
        this.snackBar.open('Obligación nueva agregada', '', this.config_snack);
        this.fetchObligations()
      }, error: err => {
        console.error(err)
      }
    })
  }

  closePanel(close: boolean){
    this.isShownLawsModal = false
    this.isShownDocumentationsModal = false
    this.fetchObligations()
  }

  //---------------------------------------FOR MODIFICATIONS OF DATE--------------------------------------//

  onDateSelected(event: any, tipo:number, id:number) {
    console.log(event.value, tipo, id)

    const fecha = new Date(event.value)
    const isoString = fecha.toISOString()
    let body = null

    switch(tipo){
      case 1: 
        body = {startPeriod: isoString}
        break
      case 2: 
        body = {firstPeriod: isoString}
        break
      case 3:
        body = {secondPeriod: isoString}
        break
      case 4:
        body = {thirdPeriod: isoString}
        break
      case 5:
        body = {fourthPeriod: isoString}
        break
      case 6:
        body = {supervisorWarning: isoString}
        break;
      default:
        body = {firstPeriod: isoString}
    }
    this.apiService.editObligation(body, id).subscribe({
      next: res => {
        console.log(res, body)
        this.snackBar.open('Fecha editada correctamente', '', this.config_snack);
      }, error: err => {
        this.snackBar.open('Ocurrió un error editando la fecha', '', this.config_snack);
      }
    })

  }

  //---------------------------------------FOR MODIFICATIONS OF LEGAL FOUNDING----------------------------//

  openLegalFounding(row:RegisterTable){
    this.universalRow = row
    if(this.isShownLawsModal == true){
      this.isShownLawsModal = false
    } else {
      this.isShownLawsModal = true
    }
  }

  artReceived(art: any[]) {
    console.log(art)
  }

  parRecieved(par:any[]){
    console.log(par)
  }

  delArtRecieved(del:any[]){
    console.log(del)
  }

  delParRecieved(del:any[]){
    console.log(del)
  }

  articleClicked(a:any){
    console.log(a)
  }

  //---------------------------------------FOR MODIFICATIONS OF DOCUMENTATIONS----------------------------//

  openDocumentations(row:any){
    if(this.isShownDocumentationsModal == true){
      this.isShownDocumentationsModal = false
    } else {
      this.isShownDocumentationsModal = true
    }

    this.universalRow = row
  }

  onDataReceived(data: any[]) {
    this.sentDocumentations = data
    console.log(this.sentDocumentations)
  }

  documentationReceived() {
    console.log(this.sentDocumentations)
  }

  setSelection(event, id) {
    console.log(event, id)

    const documentation = this.allDocumentations.find(documentation => parseInt(documentation.id) === parseInt(event))
    const index = this.dataSource.findIndex(obligation => obligation.num === id)

    this.dataSource[index].evidence.push(documentation)
  }

  removePill(evidence, id) {
    const index = this.dataSource.findIndex(obligation => obligation.num === id)
    if (index !== -1) {
      const evidenceIndex = this.dataSource[index].evidence.findIndex(ev => ev.id === evidence.id);
      if (evidenceIndex !== -1) {
        this.dataSource[index].evidence.splice(evidenceIndex, 1); // Eliminar la evidence
      }
    }
  }

  //---------------------------------------FOR MODIFICATIONS OF NAME------------------------------------//

  editName(text, id:number){
    const body = {
      name: text
    }

    this.apiService.editObligation(body, id).subscribe({
      next: res => {
        this.snackBar.open('Nombre editado exitosamente', '', this.config_snack);
      }, error: err => {
        this.snackBar.open('Ocurrió un error editando el nombre', '', this.config_snack);
      }
    })
  }

  //---------------------------------------FOR MODIFICATIONS OF VIDEOS----------------------------------//

  editVideo(type:string, id:string, oldId:string = '-1', obligationId:string, obligation:any){
    console.log(obligation)
    const id_to_remove = obligation.trainings.find(train => train.type === type)
    if(id_to_remove) oldId = id_to_remove.id

    if(oldId !== '-1'){
      const oldBody = {obligationId:''}
      this.apiService.editCapacitations(oldId, oldBody).subscribe({
        next: res => {
          console.log(res)
        }, error: err => {
          console.error(err)
        }
      })
    }

    const newBody = {obligationId:obligationId}
    this.apiService.editCapacitations(id, newBody).subscribe({
      next: res => {
        console.log(res)
      }, error: err => {
        console.error(err)
      }
    })
  }

  //---------------------------------------FOR MODIFICATIONS OF SANCTIONS-----------------------------//

  editSanctions(text, id:number){
    const body = {
      sanction: text
    }

    this.apiService.editObligation(body, id).subscribe({
      next: res => {
        this.snackBar.open('Sanciones editadas exitosamente', '', this.config_snack);
      }, error: err => {
        this.snackBar.open('Ocurrió un error editando las sanciones', '', this.config_snack);
      }
    })
  }
}
