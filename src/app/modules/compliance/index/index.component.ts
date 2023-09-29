import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import{MatDialog,MatDialogRef,MatDialogConfig,MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder,FormControl,Validators,UntypedFormGroup } from '@angular/forms';
import { CalendarFormDialogComponent } from './calendar-form-dialog/calendar-form-dialog.component';
import {startOfDay,endOfDay,subDays,addDays,endOfMonth,isSameDay,isSameMonth,addHours} from 'date-fns';
import { Subject } from 'rxjs';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView} from 'angular-calendar';
import { ApiService } from 'src/app/shared/services/api.service';
import { HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import * as moment from 'moment';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);


const colors: any = {
  red: {
    primary: '#fc4b6c',
    secondary: '#f9e7eb',
  },
  blue: {
    primary: '#1e88e5',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#ffb22b',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./index.component.scss']
})
export class CalendarDialogComponent {
  options!: UntypedFormGroup;

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     
  }

  fileNames: string[] = [];

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      this.fileNames[index] = file.name;
      // Aquí puedes manejar la carga del archivo si es necesario
    }
  }
}

@Component({
  selector: 'app-index',
  changeDetection:ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  dialogRef: MatDialogRef<CalendarDialogComponent> = Object.create({});
  dialogRef2: MatDialogRef<CalendarFormDialogComponent> = Object.create({});
  locale: string = "es";

  messageReceived = '';
  
  description = 'hola';

  lastCloseResult = '';
  actionsAlignment = '';

  title = [];

  showMain = true;

  config: MatDialogConfig = {
    disableClose: false,
    width: '',
    height: '',
    position: {
      top: '',
      bottom: '',
      left: '',
      right: '',
    },
    data: {
      action: '',
      event: [],
    },
  };
  numTemplateOpens = 0;

  view = 'month';
  viewDate: Date = new Date();

  d = new Date()
  month = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  mes = this.month[this.d.getMonth()]
  mespasadio = this.month[this.d.getMonth() === 0 ? 11 : this.d.getMonth()-1]
  mesiguiente = this.month[this.d.getMonth() === 11 ? 1 : this.d.getMonth()+1]
  anio = this.d.getFullYear().toString()
  
  actions: CalendarEventAction[] = [
    {
      label: '',
      onClick: ({ event }: { event: CalendarEvent }): void => {
       // this.handleEvent('Edit', event);
      },
    },
    {
      label: '',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        //this.events = this.events.filter((iEvent) => iEvent !== event);
        // this.handleEvent('Deleted', event);
      },
    },
  ];
  

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [    
  ];

  activeDayIsOpen = true;

  constructor(public dialog: MatDialog, @Inject(DOCUMENT) doc: any, private ntfService: NotificationService, private apiService:ApiService /*, private notification: PushNotificationService*/, ) {
   
   }

  ngOnInit(): void {
    this.getObligations();
    this.getObligationsForToday();
    /*this.notification.requestPermission().then(token=>{
      console.log(token);
     })
    this.notification.receiveMessage().subscribe(payload =>{
      console.log(payload)
    })
    */
  }

  openEventDialog(event: CalendarEvent): void {
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width: '400px',
      data: event // Puedes pasar los datos del evento al diálogo a través de la propiedad 'data'
    });
  }
  

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });

    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
      const obligationName = event.title; 
      const obligationDescription = this.description; 
      this.config.data = { event, action: obligationName, description: obligationDescription };
      //this.config.data = { event, action: obligationName};
      this.dialogRef = this.dialog.open(CalendarDialogComponent, this.config);

      this.dialogRef.afterClosed().subscribe((result: string) => {
      this.lastCloseResult = result;
      this.dialogRef = Object.create(null);
      this.refresh.next(true);
    });
    
  }

  addEvent(): void {
    this.dialogRef2 = this.dialog.open(CalendarFormDialogComponent, {
      panelClass: 'calendar-form-dialog',
      data: {
        action: 'add',
        date: new Date(),
      },
    });
    this.dialogRef2.afterClosed().subscribe((res) => {
      /*
      const dialogAction = res.action;
      const responseEvent = res.event;
      responseEvent.actions = this.actions;
      this.events.push(responseEvent);
      this.dialogRef2 = Object.create(null);
      this.refresh.next(true);*/
      this.getObligations()
    });
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }
  

  setView(view: CalendarView): void {
    this.view = view;
  }

  
 /* getObligations() {
    const date = new Date();
    let params = new HttpParams().set("day", date.getTime() / 60000);
    
    this.apiService.dates(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));        
        if (Array.isArray(res.result)) {
          this.events = res.result.flatMap(obligation => ({
            start: new Date(obligation.fecha_cumplimiento),
            end: new Date(obligation.fecha_cumplimiento),
            title: obligation.nombre,
            description: obligation.descripcion,
            color: {
              primary: obligation.color ?? "#2D57CA",
              secondary: obligation.color ?? "#2D57CA",
            },
            actions: this.actions
          }));

          console.log(res.result)
          ////this.events = this.events.sort((obj1,obj2) => Number(obj1.id) - Number(obj2.id))
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }
  */
  
  getObligations() {
    const date = new Date();
    let params = new HttpParams().set("day", date.getTime() / 60000);

    this.apiService.dates(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        if (Array.isArray(res.result)) {
          const currentDate = Date.now() / 1000 // Get the current date and time
          this.events = res.result.flatMap(obligation => {
            obligation.fecha_cumplimiento = (obligation.fecha_cumplimiento / 1000) + 86400
            console.log('obligation:',obligation)
            let color = '';
            if (obligation.fecha_cumplimiento < currentDate) {
              if(obligation.estatus.id === 1){
                color = '#00D700'
              }else if (obligation.estatus.id === 0){
                color = '#D70000'
              }
            }
            else{
              if (obligation.indicador_riesgo === 1) {
                color = '#ff3333';
              } else {
                color = '#fff700';
              }
            }
            const alerts = obligation.alertas && Array.isArray(obligation.alertas) ? obligation.alertas.map(alert => ({
              start: new Date(alert.fecha),
              end: new Date(alert.fecha),
              title: alert.mensaje,
              description: alert.tipo,
              color: {
                primary: color,
                secondary: color,
              },
              actions: this.actions
            })) : [];
            return [
              ...alerts,

              {
                start: new Date(obligation.fecha_cumplimiento * 1000),
                end: new Date(obligation.fecha_cumplimiento * 1000),
                title: obligation.nombre,
                description: obligation.descripcion,
                color: {
                  primary: color,
                  secondary: color,
                },
                actions: obligation.documentaciones,
                documentations: obligation.documentaciones
              }
            ];
          });
          //console.log(this.events);
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getObligationsForToday() {
    var fechaMañana = new Date();
    fechaMañana.setDate(fechaMañana.getDate()-1); // Agregar un día para obtener la fecha de mañana

    var d = Math.floor(fechaMañana.getTime()).toString()

    this.apiService.getObligationsForToday(d).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        let arreglo = res.result
        this.notify(arreglo)
        //console.log(res.results)
      },
      error: err => {
        console.log(err);
      }
    });
  }

  notify(variable:any) {
    variable.forEach((element, i) => {
      setTimeout(() => {
        if(element.prioridad === 3){
          this.ntfService.success(element.descripcion)
        } else if (element.prioridad === 2){
          this.ntfService.warning(element.descripcion)
        } else {
            this.ntfService.error(element.descripcion)
        }
      }, i * 1000)
    })
  }
}