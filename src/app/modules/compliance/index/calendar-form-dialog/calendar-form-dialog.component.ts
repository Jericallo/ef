import { Component, Inject, OnInit, ChangeDetectorRef} from '@angular/core';
import { Observable} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { startWith, map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CalendarEvent } from 'angular-calendar';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, FormControl } from '@angular/forms';
import { EgretCalendarEvent } from '../event.model';
import * as moment from 'moment';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Obligations, ObligationsPeriod } from 'src/app/shared/interfaces/obligations-interface';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { DateAdapter } from '@angular/material/core';
import { Data } from '@angular/router';
import { Documentations } from 'src/app/shared/interfaces/documentations-interface';
import { SearchDocumentationComponent } from 'src/app/shared/components/search-documentation/search-documentation.component';

export var alertDate: string = '';
export var alertPeriod: string = '';

export var alerts: ObligationsAlert[] = [];


interface DialogData {event?: CalendarEvent;action?: string;date?: Date;}

export interface Priority {type: string;}

interface ObligationsAlert {
  mensaje: string,
  periodo: number,
  fecha: number
}

export var chicken1: Boolean | undefined
export var chicken2: Boolean | undefined
export var chicken3: Boolean | undefined

export var period:any;


export var sendAlert1: ObligationsAlert | undefined;
export var sendAlert2: ObligationsAlert | undefined;
export var sendAlert3: ObligationsAlert | undefined;

//ALERT-TEMPLATE  ----------------------------------------------------------------------------------------------------
@Component({
  selector: 'alert-template',
  templateUrl: './alert-template.html',
  styleUrls: ['./alert-template.css'],
})

export class AlertTemplate implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';

  message: string | undefined;
  message2: string | undefined;
  message3: string | undefined;
  selectPeriod = null;
  showMain = true;
  showSpinner = false;

  color = "green";
  checked = false;
  checked2 = false;
  checked3 = false;
  disabled = false;

  dateAlert1: any | undefined;
  dateAlert2: any | undefined;
  dateAlert3: any | undefined;

  startDate: any;

  myControlMessage = new FormControl({value: '', disabled: !this.checked});
  myControlMessage2 = new FormControl({value: '', disabled: !this.checked2});
  myControlMessage3 = new FormControl({value: '', disabled: !this.checked3});

  constructor(public snackBar: MatSnackBar, 
                public dialogRef: MatDialogRef<AlertTemplate>, @Inject(MAT_DIALOG_DATA) public data: any, 
                  private readonly cdRef: ChangeDetectorRef) {
  }

  ngOnInit() {
  }



  checkValuesAlert() {
    if(this.checked || this.checked2 || this.checked3) {
      return false;
    } else return true;
  }

  alert1Change() {
    const duration = moment.duration(this.dateAlert1);
    sendAlert1 = {
      mensaje: this.message ? this.message : '',
      periodo: period -1,
      fecha: duration.asMilliseconds()
    }
    chicken1 = this.checked
    // aqui estaba asMinutes pero asi explota
    //alerts.push({mensaje:this.message ? this.message: '', periodo: duration.asMilliseconds()})
  }

  alert2Change() {
    
    const duration = moment.duration(this.dateAlert2);
    sendAlert2 = {
      mensaje: this.message2 ? this.message2 : '',
      periodo: period -1,
      fecha:duration.asMilliseconds()
    }
    chicken2 = this.checked2
  }

  alert3Change() {
    const duration = moment.duration(this.dateAlert3);
    sendAlert3 = {
      mensaje: this.message3 ? this.message3 : '',
      periodo: period -1,
      fecha:duration.asMilliseconds()
    }
    chicken3 = this.checked3
  }

  onToggleChanged(event: MatSlideToggleChange, alertNumber: number) {

    switch(alertNumber){
      case 1: 
        this.checked = event.checked;
        this.checked ? this.myControlMessage.enable() : this.myControlMessage.disable();
        break;
      case 2:
        this.checked2 = event.checked;
        this.checked2 ? this.myControlMessage2.enable() : this.myControlMessage2.disable();
        break;
      case 3:
        this.checked3 = event.checked;
        this.checked3 ? this.myControlMessage3.enable() : this.myControlMessage3.disable();
        break;
    }
  }
  
  isAlertsDisabled() {
    if(alertDate != ""){

      const durationDate = moment.duration(alertDate).subtract(1, 'day');
      const dateMil = durationDate.asMilliseconds();

      const durationPeriod = moment.duration(alertPeriod);
      const periodMil = durationPeriod.asMilliseconds();

      const subDate = dateMil - periodMil;
      this.startDate = moment(subDate).format();

      return false;
    } else {

      this.checked = false;
      this.checked2 = false;
      this.checked3 = false;

      this.dateAlert1 = "";
      this.dateAlert2 = "";
      this.dateAlert3 = "";

      this.myControlMessage.reset();
      this.myControlMessage2.reset();
      this.myControlMessage3.reset();
      return true;
    }
  }

  

  getMinDate() {
    return this.startDate;
  }

  getMaxDate() {
    return alertDate;
  }
}

// CALENDAR FORM  ----------------------------------------------------------------------------------------------------

@Component({
  selector: 'app-calendar-form-dialog',
  templateUrl: './calendar-form-dialog.component.html',
  styleUrls: ['./calendar-form-dialog.component.scss'],
})
export class CalendarFormDialogComponent implements OnInit {
  
  myControlObligations = new FormControl('');
  myControlDescription = new FormControl('');
  myControlQuantity = new FormControl(1)

  myControlRisk = new FormControl<string | Priority>('');
  optionsRisk: Priority[] = [{ type: 'Alta' }, { type: 'Media' }, { type: 'Baja' }];
  filteredRiskOptions: Observable<any> | undefined;

  myControlPriority = new FormControl<string | Priority>('');
  optionsPriority: Priority[] = [{ type: 'Alta' }, { type: 'Media' }, { type: 'Baja' }];
  filteredPriorityOptions: Observable<any> | undefined;
  
  myControlPeriod = new FormControl<ObligationsPeriod | string>('');
  optionsPeriod: ObligationsPeriod[] = [];
  filteredPeriodOptions: Observable<any> | undefined;
 
  obligations = null;
  description = null;
  date: string = '';
  dateS: any;
  dateSI: any;
  dateF: any;
  dateNow:any;
  selectType = null;
  selectPeriod = null;
  htmlContent = "";
  quantity = 1;

  showFinal = false;
  showMain = true;
  showSpinner = false;
  showDocumentation = false;

  event: any;
  dialogTitle: string;
  eventForm: UntypedFormGroup;
  action: any;

  sendingObligation: Obligations = {
    periodo: 10000,
    id_cliente: 2,
    id_tipo: 3,
    prioridad: 3,
    nombre: null,
    fecha_cumplimiento: null,
    fecha_cumplimiento_ideal:null,
    indicador_riesgo:1,
    alertas: [],
    con_documento: false,
    texto_documentos: "",
    documentaciones: [],
    fecha_final:null
  }

  isr = false;
  iva = false;
  nom = false;
  otr = false
  
  sentDocumentations = null

  constructor(
    public dialogRef: MatDialogRef<CalendarFormDialogComponent>, private http: HttpClient, private apiService:ApiService, 
    

    @Inject(MAT_DIALOG_DATA) private data: DialogData,
    private formBuilder: UntypedFormBuilder,
  ) {
    this.event = data.event;
    this.action = data.action;
    if (this.action === 'edit') {
      this.dialogTitle = this.event.title;
    } else {
      this.dialogTitle = 'Add Event';
      this.event = new EgretCalendarEvent({
        start: data.date,
        end: data.date,
      });
    }
    
    // console.log(data);
    this.eventForm = this.buildEventForm(this.event);
  }
  
  buildEventForm(event: any): any {
    return new UntypedFormGroup({
      _id: new UntypedFormControl(event._id),
      title: new UntypedFormControl(event.title),
      start: new UntypedFormControl(event.start),
      end: new UntypedFormControl(event.end),
      allDay: new UntypedFormControl(event.allDay),
      color: this.formBuilder.group({
        primary: new UntypedFormControl(event.color.primary),
        secondary: new UntypedFormControl(event.color.secondary),
      }),
      meta: this.formBuilder.group({
        location: new UntypedFormControl(event.meta.location),
        notes: new UntypedFormControl(event.meta.notes),
      }),
      draggable: new UntypedFormControl(true),
    });
  }

  onToggleDocumentationChanged(event: MatSlideToggleChange, alertNumber: number) {
    this.showDocumentation = !this.showDocumentation
  }

  //RISK ----------------------------------------------------------------------------------------------------

  selectedRisk(opt: MatAutocompleteSelectedEvent) {
    this.assignPriorityAndRisk(opt.option.value.type, "risk");
    //this.myControlRisk.setValue(event.option.value);
  }

  filterRiskOptions(value: string): Priority[] {
    const filterValue = value.toLowerCase();
    return this.optionsRisk.filter(option => option.type.toLowerCase().includes(filterValue));
  }

  displayRisk(type: Priority): string {
    return type && type.type ? type.type : '';
  }

  private _filterRisk(doc: string): Priority[] {
    const filterValueRisk = doc.toLowerCase();
    return this.optionsRisk.filter(option => option.type.toLowerCase().includes(filterValueRisk));
  }

  //PRIORITY  ----------------------------------------------------------------------------------------------------

  selectedPriority(opt: MatAutocompleteSelectedEvent) {
    this.assignPriorityAndRisk(opt.option.value.type, "priority");
  }

  displayPriority(type: Priority): string {
    return type && type.type ? type.type : '';
  }

  private _filterPriority(doc: string): Priority[] {
    const filterValuePriority = doc.toLowerCase();
    return this.optionsPriority.filter(option => option.type.toLowerCase().includes(filterValuePriority));
  }


//PERIOD ----------------------------------------------------------------------------------------------------

  selectedPeriod(opt: MatAutocompleteSelectedEvent) {
    period = opt.option.value.minutos;
  }

  displayPeriod(periodo: ObligationsPeriod): string {
    return periodo && periodo.nombre ? periodo.nombre : '';
  }

  handleEmptyPeriod(event: any) {
    event.target.value === '' ? this.selectPeriod = null : "";
  }

  handleEmptyQuantity(event: any) {
    event.target.value === '' ? this.quantity = null : "";
  }
  
  private _filterPeriod(doc: string): ObligationsPeriod[] {
    const filterValuePeriod = doc.toLowerCase();
    return this.optionsPeriod.filter(option => option.nombre.toLowerCase().includes(filterValuePeriod));
  }


  selectedDate() {
    const fechaAhora = moment.duration(this.dateS).asMilliseconds();
    this.sendingObligation.fecha_cumplimiento = fechaAhora
    const dia = this.dateS.getDate() 
    const mes = this.dateS.getMonth()
    const ano = this.dateS.getFullYear()
    let fecha = ''
    if(dia < 10 && mes > 9){
      fecha = `${mes}/0${dia}/${ano}`
    }else if (dia > 9 && mes < 10) {
      fecha = `0${mes}/${dia}/${ano}`
    }else if (dia < 10 && mes < 10){
      fecha = `0${dia}/0${mes}/${ano}`
    } else {
      fecha = `${dia}/${mes}/${ano}`
    }
    
    this.dateNow = fecha

    alertDate = fecha
  }

  selectedDateIdeal() {
    const fechaAhora = moment.duration(this.dateSI).asMilliseconds();
    this.sendingObligation.fecha_cumplimiento_ideal = fechaAhora
  }

  selectedFinalDate() {
    const fechaAhora = moment.duration(this.dateF).asMilliseconds();
    console.log(fechaAhora)
    this.sendingObligation.fecha_final = fechaAhora
  }

  saveObligation() {
    if(chicken1) { alerts.push(sendAlert1) }
    if(chicken2) { alerts.push(sendAlert2) }
    if(chicken3) { alerts.push(sendAlert3) }
    var a = new Date(this.sendingObligation.fecha_cumplimiento * 1000);
    var dayOfMonth = a.getDate()
    let isr = 0; let iva = 0; let nom = 0; let otr = 0;
    if(this.isr) isr = 1
    if(this.iva) iva = 1
    if(this.nom) nom = 1
    if(this.otr) otr = 1

    console.log(this.showFinal)
    console.log(this.isr)
    
    const body = {model:"obligaciones", data: {
      fecha_cumplimiento: this.sendingObligation.fecha_final,
      id_cliente: 2,
      indicador_riesgo: this.sendingObligation.indicador_riesgo,
      prioridad: this.sendingObligation.prioridad,
      nombre: this.obligations,
      descripcion: this.description,
      id_tipo: this.sendingObligation.id_tipo,
      periodo: period * this.quantity,
      con_document: 0,
      documentaciones:this.sentDocumentations,
      id_usuario: 2,
      alertas: alerts,
      dia_del_mes:dayOfMonth,
      fecha_inicio:this.sendingObligation.fecha_cumplimiento,
      //obligacion:{
        impuesto_isr:isr,
        impuesto_otro:otr,
        impuesto_nomina:nom,
        impuesto_iva: iva
      //}
    }};
    console.log(body)
    this.apiService.postObligations(body).subscribe({
      next: response => {
        const respuesta = JSON.parse(this.apiService.decrypt(response.message,"private"));
        if(respuesta.status === 'OK'){
          alert('Obligación agregada correctamente.')
        } else {
          alert('Ocurrió un error al agregar la obligación, intente de nuevo más tarde.')
        }
        alerts = []
      },
      error: err => {
        alert('Ocurrió un error al agregar la obligación, intente de nuevo más tarde.')
        console.log(err);
        alerts = []
      }
    });
    //this.resetFields();
  }

  resetFields() {
    this.obligations = null;
    this.description = null;
    this.myControlPriority.reset();
    this.myControlRisk.reset();
    this.dateS = null;
    this.htmlContent = '';
    alertDate = "";
  }

  ngOnInit() {

    this.filteredPriorityOptions = this.myControlPriority.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.type;
        return name ? this._filterPriority(name as string) : this.optionsPriority.slice();
      }),
    );

    this.filteredRiskOptions = this.myControlRisk.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.type;
        return name ? this._filterRisk(name as string) : this.optionsRisk.slice();
      }),
    );

    this.filteredPeriodOptions = this.myControlPeriod.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map(value => {
        const name = typeof value === 'string' ? value : value?.nombre;
        return name ? this._filterPeriod(name as string) : this.optionsPeriod.slice();
      }),
    );

    this.getPeriod()
    chicken1 = false
    chicken2 = false
    chicken3 = false
  }

  getPeriod() {
    this.apiService.getPeriods().subscribe({
      next: res =>{
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        if (res.status === 'OK'){
          this.optionsPeriod = res.result.map((period: any) => {
            return {
              id: period.id,
              nombre: period.nombre,
              milisegundos: period.milisegundos,
              fecha_creacion: period.fecha_creacion,
              fecha_modificacion: period.fecha_modificacion,
              minutos:period.minutos
            };
          });
        }
      }
    })
  }
    
  assignPriorityAndRisk(type: string, opt: string) {
    switch (type) {
      case "Alta":
        opt == "priority" ? this.sendingObligation.prioridad = 1 : this.sendingObligation.indicador_riesgo = 1;
        break;
      case "Media":
        opt == "priority" ? this.sendingObligation.prioridad = 2 : this.sendingObligation.indicador_riesgo = 2;
        break;
      case "Baja":
        opt == "priority" ? this.sendingObligation.prioridad = 3 : this.sendingObligation.indicador_riesgo = 3;
        break;
      default:
        break;
    }
  }

  onDataReceived(data: any[]) {
    this.sentDocumentations = data
  }
}