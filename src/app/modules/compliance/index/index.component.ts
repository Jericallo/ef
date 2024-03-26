import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef, OnDestroy, ElementRef, AfterViewChecked, ViewChild } from '@angular/core';
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
import { ModalCalendarDayComponent } from './modal-calendar-day/modal-calendar-day.component';
import { MousePositionService } from './mouse-position.service';
import { ModalDataService } from './modal-data.service';

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
export class IndexComponent implements OnInit, OnDestroy, AfterViewChecked {
  dialogRef: MatDialogRef<CalendarDialogComponent> = Object.create({});
  dialogRef2: MatDialogRef<CalendarFormDialogComponent> = Object.create({});
  @ViewChild('scrollElement') scrollElement: ElementRef;

  locale: string = "es";

  messageReceived = '';
  
  description = 'hola';

  lastCloseResult = '';
  actionsAlignment = '';

  title = [];

  showMain = true;
  scrollPending: boolean = false;

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

  sendableDate: Date = new Date();

  d = new Date()
  month = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  mes = this.month[this.d.getMonth()]
  mespasadio = this.month[this.d.getMonth() === 0 ? 11 : this.d.getMonth()-1]
  mesiguiente = this.month[this.d.getMonth() === 11 ? 1 : this.d.getMonth()+1]
  anio = this.d.getFullYear().toString()

  mesMostrar = 'Mes actual'

  isModalOpen = false //Detecta si la modal ya está abierta, para evitar abrir varias.
  
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

  activeDayIsOpen = false;

  cumplimientos:any

  constructor(
    public dialog: MatDialog, 
    @Inject(DOCUMENT) doc: any, 
    private ntfService: NotificationService, 
    private apiService:ApiService /*, 
    private notification: PushNotificationService*/, 
    private cdr: ChangeDetectorRef,
    private mousePositionService: MousePositionService,
    private modalDataService: ModalDataService,
    private elementRef: ElementRef ) {
    
  }

  ngOnInit(): void {
    this.getObligations();
    this.getCumplimientos();
    /*this.notification.requestPermission().then(token=>{
      console.log(token);
     })
    this.notification.receiveMessage().subscribe(payload =>{
      console.log(payload)
    })
    */
    document.addEventListener('mousemove', this.trackMouse.bind(this));
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousemove', this.trackMouse.bind(this));
  }

  ngAfterViewChecked(): void {
    // Verifica si hay un scroll pendiente y la vista se ha actualizado
    if (this.scrollPending) {
      console.log('scroleando')
      this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });

      // Restablece la bandera de scroll pendiente
      this.scrollPending = false;
    }
  }

  trackMouse(event: MouseEvent) {
    this.mousePositionService.trackMousePosition(event);
  }

  openEventDialog(event: CalendarEvent): void {
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width: '70%',
      data: event // Puedes pasar los datos del evento al diálogo a través de la propiedad 'data'
    });
  }

  dayHovered(date:Date): void {
    // if(!this.isModalOpen) return
    // this.modalDataService.setData({ cumplimientos: this.cumplimientos, date: date })
    // this.exModalData = { cumplimientos: this.cumplimientos, date: date }
  }
  

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    // if(this.isModalOpen) return
    // this.modalDataService.setData({ cumplimientos: this.cumplimientos, date: date })

    // this.exModalData = { cumplimientos: this.cumplimientos, date: date }
    // this.filterCumplimientos()

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.width = '80%';
    // dialogConfig.maxWidth= '80vw'
    // dialogConfig.height = 'max-content';
    // dialogConfig.maxHeight = '50vh';
    // dialogConfig.hasBackdrop = false; // No mostrará el fondo oscuro
    // dialogConfig.disableClose = false; // Permite cerrar la modal haciendo clic fuera de ella

    // const dialogRef = this.dialog.open(ModalCalendarDayComponent, dialogConfig);
    // this.isModalOpen = true
    // dialogRef.afterClosed().subscribe(result => {
    //   this.isModalOpen = false
    // });

    // this.mousePositionService.setDialogRef(dialogRef);
    this.exModalData = { cumplimientos: this.cumplimientos, date: date }
    this.filterCumplimientos()
    this.scrollToBottom()
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
      width:'1000px',
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
  
  getObligations(date = new Date()) {
    console.log(date.getTime())
    let params = new HttpParams().set("day", (date.getTime() / 60000).toString());
    params = params.set('where', date.getTime().toString());
    params = params.set('id_usuario', this.apiService.getId().toString());
        
    this.apiService.dates(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        if (Array.isArray(res.result)) {
          console.log(res)
          const currentDate = Date.now() // Get the current date and time
          this.events = res.result.flatMap(obligation => {
            obligation.fecha_inicio = (obligation.fecha_inicio * 60000)
            //let color = this.isFechaMaxima(obligation, currentDate);
            let color = '';
            if (obligation.fecha_inicio < currentDate) {
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

            const obligacionesFuturas = obligation.obligaciones_futuras && Array.isArray(obligation.obligaciones_futuras) && obligation.obligaciones_futuras.length > 0 ? obligation.obligaciones_futuras.map(element => ({
              start:new Date(element),
              end:new Date(element),
              title:obligation.nombre,
              description:obligation.descripcion,
              color: {
                primary: color,
                secondary: color,
              },
              actions: obligation.documentaciones,
              documentations: obligation.documentaciones
            })) : [];

            return [
              ...alerts,
              ...obligacionesFuturas,
              
            ];

          });
          /*this.apiService.historial(params).subscribe({
            next: res => {
              res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
              if (Array.isArray(res.result)) {
                const currentDate = Date.now() // Get the current date and time
                let historial = res.result.flatMap(obligation => {
                  let color = '';
                  if (obligation.fecha < currentDate) {
                    if(obligation.obligacion.estatus.id === 1){
                      color = '#00D700'
                    }else if (obligation.obligacion.estatus.id === 0){
                      color = '#D70000'
                    }
                  }
                  else{
                    if (obligation.fecha === 1) {
                      color = '#ff3333';
                    } else {
                      color = '#fff700';
                    }
                  }
                  const alerts = obligation.obligacion.alertas && Array.isArray(obligation.obligacion.alertas) ? obligation.alertas.obligacion.map(alert => ({
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
                      start: new Date(parseInt(obligation.fecha)),
                      end: new Date(parseInt(obligation.fecha)),
                      title: obligation.obligacion.nombre,
                      description: obligation.obligacion.descripcion,
                      color: {
                        primary: color,
                        secondary: color,
                      },
                      actions: obligation.obligacion.documentaciones,
                      documentations: obligation.obligacion.documentaciones
                    }
                  ];
                });
                console.log(this.events)
                historial.forEach((element) => {
                  this.events.push(element)
                })
                console.log(this.events)
              }
            },
            error: err => {
              console.log(err);
            }
          });*/
          this.cdr.detectChanges();    //this.getObligationsForToday();
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getCumplimientos(){
    this.apiService.getCumplimientosControl().subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        console.log(res.result)
        this.cumplimientos = res.result;
        this.cdr.detectChanges();
      }
    });
  }

  monthNext(){
    const today = new Date()

    this.sendableDate.setMonth(this.sendableDate.getMonth()+1)
    if(this.sendableDate.getMonth() === today.getMonth()){
      this.mesMostrar = 'Mes Actual'
    } else {
      this.mesMostrar = this.month[this.sendableDate.getMonth()]
    }

    this.events = []
    this.getObligations(this.sendableDate)
  }

  monthPrevious(){
    const today = new Date()

    this.sendableDate.setMonth(this.sendableDate.getMonth()-1)
    if(this.sendableDate.getMonth() === today.getMonth()){
      this.mesMostrar = 'Mes Actual'
    } else {
      this.mesMostrar = this.month[this.sendableDate.getMonth()]
    }

    this.events = []
    this.getObligations(this.sendableDate)
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

  isFechaMaxima(element: any, column: number): string {
    console.log(element)
    if (column === 0) {
      return 'transparent';
    }
    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima_fin;
    let fechaCumplimiento = element.cumplimientos_obligacion.fecha_cumplimiento
    let fechaMinima = element.cumplimientos_obligacion.fecha_inicio_ideal
    let fechaInicioCumplimiento = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
    let fechaInicioCumplimientoFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;
    let fechaIdeal = element.cumplimientos_obligacion.fecha_ideal
    const fechaHoy = Date.now()



    if((element.cumplimientos_obligacion.completado === 1 || element.cumplimientos_obligacion.completado === 2) && fechaCumplimiento !== null) {
      if(fechaCumplimiento.toString() === fechaColumna.toString()) return '#ffcc0c'
      if(fechaCumplimiento.toString() <= fechaColumna.toString()) return 'transparent'
    } 

    if(element.cumplimientos_obligacion.completado === 3 && fechaCumplimiento !== null) {
      if(fechaCumplimiento.toString() === fechaColumna.toString()) return 'green'
      if(fechaCumplimiento.toString() <= fechaColumna.toString()) return 'transparent'
    } 
    
    if(fechaMinima.toString() > fechaColumna.toString()) return 'transparent'

    if(fechaMaxima.toString() > fechaColumna.toString()) {
      if(fechaColumna.toString() >= (fechaIdeal).toString()) return 'red'
      else return '#ffcc0c'
    } else if(fechaMaxima.toString() === fechaColumna.toString()) return 'red'
     else if(fechaMaxima.toString() < fechaColumna.toString()) return 'transparent'
  }

  verifySpot(mode:number, day:Date){
    if(this.cumplimientos === undefined || this.cumplimientos === null){
      return 0
    }
    let milis = day.getTime() 
    let contador = 0;
    if(mode === 1) {
      for (const objeto of this.cumplimientos) {
        if (milis >= objeto.cumplimientos_obligacion.fecha_maxima && milis <= objeto.cumplimientos_obligacion.fecha_maxima_fin && objeto.cumplimientos_obligacion.fecha_cumplimiento === null) {
            contador++;
        }
      }

      return contador;
    } else if( mode === 2 ) {
      for (const objeto of this.cumplimientos) {
        if (milis >= objeto.cumplimientos_obligacion.fecha_ideal && milis <= objeto.cumplimientos_obligacion.fecha_ideal_fin && objeto.cumplimientos_obligacion.fecha_cumplimiento === null) {
            contador++;
        }
      }

      return contador;
    } else if( mode === 3 ) {
      for (const objeto of this.cumplimientos) {
        if (milis >= objeto.cumplimientos_obligacion.fecha_inicio_cumplimiento && milis <= objeto.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin && objeto.cumplimientos_obligacion.fecha_cumplimiento === null) {
            contador++;
        }
      }

      return contador;
    } else if( mode === 4 ) {
      for (const objeto of this.cumplimientos) {
        if (milis >= objeto.cumplimientos_obligacion.fecha_inicio_ideal && milis <= objeto.cumplimientos_obligacion.fecha_inicio_ideal_fin && objeto.cumplimientos_obligacion.fecha_cumplimiento === null) {
            contador++;
        }
      }

      return contador;
    } else if( mode === 5 ) {
      for (const objeto of this.cumplimientos) {
        if(objeto.cumplimientos_obligacion.fecha_cumplimiento && objeto.cumplimientos_obligacion.fecha_cumplimiento >= milis && (objeto.cumplimientos_obligacion.completado == 1 || objeto.cumplimientos_obligacion.completado == 2)) {
          contador ++;
        }
      }

      return contador;
    } else if( mode === 6 ) {
      for (const objeto of this.cumplimientos) {
        if(objeto.cumplimientos_obligacion.fecha_cumplimiento && objeto.cumplimientos_obligacion.fecha_cumplimiento == milis && objeto.cumplimientos_obligacion.completado == 3) {
          contador ++;
        }
      }

      return contador;
    }
    return 0
  }











  exModalData: any;

  theCumplimientos = []

  banderaRoja = false
  banderaAmarilla = false
  banderaVerde = false


  modalIsIndicadorLento(element: any, column: any) {
    column = (column.getTime()).toString()
    if (column === 0) return false;
    if(element.cumplimientos_obligacion.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaInicioIdeal = element.cumplimientos_obligacion.fecha_inicio_ideal;
    let fechaInicioIdealFin = element.cumplimientos_obligacion.fecha_inicio_ideal_fin;
    let fechaIdeal = element.cumplimientos_obligacion.fecha_ideal
    let fechaIdealFin = element.cumplimientos_obligacion.fecha_ideal_fin

    const DateToday = new Date();
    DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
    DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

    const fechaHoy = DateToday.getTime();
    
    if (
        fechaColumna.toString() <= fechaMaxima.toString() &&
        //fechaColumna.toString() >= fechaHoy.toString() &&
        (fechaColumna >= fechaInicioIdeal && fechaColumna <= fechaIdealFin)
    ) {
        return true;
    }

    return false;
}

  modalIsIndicadorRapido(element: any, column: any){
    column = (column.getTime()).toString()
    if(column === 0) return false
    if(element.cumplimientos_obligacion.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaMaximaFin = element.cumplimientos_obligacion.fecha_maxima_fin
    let fechaInicioCumplimiento = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
    let fechaInicioCumplimientoFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;

    const DateToday = new Date();
    DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
    DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

    const fechaHoy = DateToday.getTime();

    if(fechaColumna.toString() === fechaMaxima.toString() && element.cumplimientos_obligacion.completado === false) return true

    if(fechaColumna.toString() <= fechaMaximaFin.toString() ){
     if(fechaColumna >= fechaInicioCumplimiento && fechaColumna <= fechaInicioCumplimientoFin) return true
      if(fechaColumna >= fechaMaxima && fechaColumna <= fechaMaximaFin) return true
    }
    return false
  }

  modalIsFechaMaxima(element: any, column: any): string {
    column = (column.getTime()).toString()
    if (column === 0) {
      return 'transparent';
    }
    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima_fin;
    let fechaCumplimiento = element.cumplimientos_obligacion.fecha_cumplimiento
    let fechaMinima = element.cumplimientos_obligacion.fecha_inicio_ideal
    let fechaInicioCumplimiento = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
    let fechaInicioCumplimientoFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;
    let fechaIdeal = element.cumplimientos_obligacion.fecha_ideal
    const fechaHoy = Date.now()



    if((element.cumplimientos_obligacion.completado === 1 || element.cumplimientos_obligacion.completado === 2) && fechaCumplimiento !== null) {
      if(fechaCumplimiento.toString() === fechaColumna.toString()) return '#ffcc0c'
      if(fechaCumplimiento.toString() <= fechaColumna.toString()) return 'transparent'
    } 

    if(element.cumplimientos_obligacion.completado === 3 && fechaCumplimiento !== null) {
      if(fechaCumplimiento.toString() === fechaColumna.toString()) return 'green'
      if(fechaCumplimiento.toString() <= fechaColumna.toString()) return 'transparent'
    } 
    
    if(fechaMinima.toString() > fechaColumna.toString()) return 'transparent'

    if(fechaMaxima.toString() > fechaColumna.toString()) {
      if(fechaColumna.toString() >= (fechaIdeal).toString()) return 'red'
      else return '#ffcc0c'
    } else if(fechaMaxima.toString() === fechaColumna.toString()) return 'red'
     else if(fechaMaxima.toString() < fechaColumna.toString()) return 'transparent'
  }

  modalIsRojorapido(element: any, column: any){
    column = (column.getTime()).toString()
    if(column === 0) return false
    if(element.cumplimientos_obligacion.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaMaximaFin = element.cumplimientos_obligacion.fecha_maxima_fin
    let fechaInicioCumplimiento = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
    let fechaInicioCumplimientoFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;

    const DateToday = new Date();
    DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
    DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

    const fechaHoy = DateToday.getTime();

    if(fechaColumna.toString() === fechaMaxima.toString() && element.cumplimientos_obligacion.completado === false) {this.banderaRoja = true; return true}

    if(fechaColumna.toString() <= fechaMaximaFin.toString() ){
      if(fechaColumna >= fechaMaxima && fechaColumna <= fechaMaximaFin) return true
    }
    return false
  }

  modalIsRojoLento(element: any, column: any) {
    column = (column.getTime()).toString()
    if (column === 0) return false;
    if(element.cumplimientos_obligacion.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaInicioIdeal = element.cumplimientos_obligacion.fecha_inicio_ideal;
    let fechaInicioIdealFin = element.cumplimientos_obligacion.fecha_inicio_ideal_fin;
    let fechaIdeal = element.cumplimientos_obligacion.fecha_ideal
    let fechaIdealFin = element.cumplimientos_obligacion.fecha_ideal_fin

    const DateToday = new Date();
    DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
    DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

    const fechaHoy = DateToday.getTime();
    
    if (
        fechaColumna.toString() <= fechaMaxima.toString() &&
        //fechaColumna.toString() >= fechaHoy.toString() &&
        (fechaColumna >= fechaIdeal && fechaColumna <= fechaIdealFin)
    ) {
      this.banderaRoja = true
        return true;
    }

    return false;
}

modalIsAmarilloRapido(element: any, column: any){
  column = (column.getTime()).toString()
  if(column === 0) return false
  if(element.cumplimientos_obligacion.completado !== 0) return false 

  let fechaColumna = column;
  let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
  let fechaMaximaFin = element.cumplimientos_obligacion.fecha_maxima_fin
  let fechaInicioCumplimiento = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
  let fechaInicioCumplimientoFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;

  const DateToday = new Date();
  DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
  DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

  const fechaHoy = DateToday.getTime();

  if(fechaColumna.toString() === fechaMaxima.toString() && element.cumplimientos_obligacion.completado === false) return true

  if(fechaColumna.toString() <= fechaMaximaFin.toString() ){
   if(fechaColumna >= fechaInicioCumplimiento && fechaColumna <= fechaInicioCumplimientoFin) {this.banderaAmarilla = true; return true}
  }
  return false
}

modalIsAmarilloLento(element: any, column: any) {
  column = (column.getTime()).toString()
  if (column === 0) return false;
  if(element.cumplimientos_obligacion.completado !== 0) return false 

  let fechaColumna = column;
  let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
  let fechaInicioIdeal = element.cumplimientos_obligacion.fecha_inicio_ideal;
  let fechaInicioIdealFin = element.cumplimientos_obligacion.fecha_inicio_ideal_fin;


  const DateToday = new Date();
  DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
  DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

  const fechaHoy = DateToday.getTime();
  
  if (
      fechaColumna.toString() <= fechaMaxima.toString() &&
      //fechaColumna.toString() >= fechaHoy.toString() &&
      (fechaColumna >= fechaInicioIdeal && fechaColumna <= fechaInicioIdealFin)
  ) {
    this.banderaAmarilla = true
      return true;
  }

  return false;
}

modalIsAmarilloFijo(element: any, column: any) {
  column = (column.getTime()).toString()
  if (column === 0) return false;

  let fechaCumplimiento = element.cumplimientos_obligacion.fecha_cumplimiento
  let completado = element.cumplimientos_obligacion.completado

  if (column > fechaCumplimiento) return false

  if (completado === 1 || completado === 2) return true
  else return false
}

modalIsVerde(element: any, column: any): boolean {
  column = (column.getTime()).toString()
  if (column === 0) {
    return false;
  }
  let fechaColumna = column;
  let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima_fin;
  let fechaCumplimiento = element.cumplimientos_obligacion.fecha_cumplimiento
  let fechaMinima = element.cumplimientos_obligacion.fecha_inicio_ideal
  let fechaInicioCumplimiento = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
  let fechaInicioCumplimientoFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;
  let fechaIdeal = element.cumplimientos_obligacion.fecha_ideal
  const fechaHoy = Date.now()



  if((element.cumplimientos_obligacion.completado === 1 || element.cumplimientos_obligacion.completado === 2) && fechaCumplimiento !== null) {
    if(fechaCumplimiento.toString() === fechaColumna.toString()) return false
    if(fechaCumplimiento.toString() <= fechaColumna.toString()) return false
  } 

  if(element.cumplimientos_obligacion.completado === 3 && fechaCumplimiento !== null) {
    if(fechaCumplimiento.toString() === fechaColumna.toString()) {this.banderaVerde = true; return true}
    if(fechaCumplimiento.toString() <= fechaColumna.toString()) return false
  } 
  
  if(fechaMinima.toString() > fechaColumna.toString()) return false

  if(fechaMaxima.toString() > fechaColumna.toString()) {
    if(fechaColumna.toString() >= (fechaIdeal).toString()) return false
    else return false
  } else if(fechaMaxima.toString() === fechaColumna.toString()) return false
   else if(fechaMaxima.toString() < fechaColumna.toString()) return false
}

  filterCumplimientos(){
    this.theCumplimientos = []
    let milis = (this.exModalData.date.getTime()).toString()

    for (const cumplimiento of this.exModalData.cumplimientos) {
      if (milis >= cumplimiento.cumplimientos_obligacion.fecha_inicio_ideal && milis <= cumplimiento.cumplimientos_obligacion.fecha_maxima_fin) {
        this.theCumplimientos.push(cumplimiento)
      }
    }
    console.log(this.theCumplimientos)
  }

  scrollToBottom(): void {
    console.log('entra')
    this.scrollPending = true;
  }
}