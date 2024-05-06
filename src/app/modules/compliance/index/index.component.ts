import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef, OnDestroy, ElementRef, AfterViewChecked, ViewChild, HostListener, Renderer2 } from '@angular/core';
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
import { MatTooltip } from '@angular/material/tooltip';

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
  @ViewChild('scrollCalendar') scrollCalendar: ElementRef;

  @ViewChild('toolTip1', {static:false}) tooltip1: MatTooltip;
  @ViewChild('toolTip2', {static:false}) tooltip2: MatTooltip;  
  @ViewChild('toolTip3', {static:false}) tooltip3: MatTooltip;
  @ViewChild('toolTip4', {static:false}) tooltip4: MatTooltip;
  @ViewChild('toolTip5', {static:false}) tooltip5: MatTooltip;
  @ViewChild('toolTip6', {static:false}) tooltip6: MatTooltip;

  locale: string = "es";

  messageReceived = '';
  
  description = 'hola';

  lastCloseResult = '';
  actionsAlignment = '';

  title = [];

  showMain = true;
  scrollPending: boolean = false;
  scrollToTopPending: boolean = false;

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

  showToolTip = true

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

  isTopOfPage: boolean = false; // Variable para rastrear si el usuario está en la parte superior de la página

  constructor(
    public dialog: MatDialog, 
    @Inject(DOCUMENT) doc: any, 
    private ntfService: NotificationService, 
    private apiService:ApiService /*, 
    private notification: PushNotificationService*/, 
    private cdr: ChangeDetectorRef,
    private mousePositionService: MousePositionService,
    private modalDataService: ModalDataService,
    private elementRef: ElementRef,
    private renderer: Renderer2 ) {
    
  }

  onScrollEvent($event){
    // console.log($event['Window']);
     console.log("ayuda");
  }

  ngOnInit(): void {
    this.getCumplimientos();

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

    if (this.scrollToTopPending) {
      console.log('scroleando')
      this.scrollCalendar.nativeElement.scrollIntoView({ behavior: 'smooth' });

      // Restablece la bandera de scroll pendiente
      this.scrollToTopPending = false;
    }
  }

  trackMouse(event: MouseEvent) {
    this.mousePositionService.trackMousePosition(event);
  }

  showButton(mode:number){
    if (mode == 1) {
      this.isTopOfPage = true
    } else {
      this.isTopOfPage = false
    }
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
      this.getCumplimientos()
    });
  }

  deleteEvent(eventToDelete: CalendarEvent): void {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }
  

  setView(view: CalendarView): void {
    this.view = view;
  }

  getCumplimientos(){
    let date = new Date(this.sendableDate), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    this.apiService.getCumplimientos(firstDay.getTime(), lastDay.getTime()).subscribe({
      next: res => {
        this.cumplimientos = res.tasks;
        this.cumplimientos = this.cumplimientos.concat(res.overdue_tasks)
        this.cumplimientos.forEach(element => {
          element.obligations.respaldo =''
        });
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
    this.getCumplimientos()
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
    this.getCumplimientos()
  }

  isFechaMaxima(element: any, column: number): string {
    console.log(element)
    if (column === 0) {
      return 'transparent';
    }
    let fechaColumna = column;
    let fechaMaxima = element.fecha_maxima_fin;
    let fechaCumplimiento = element.fecha_cumplimiento
    let fechaMinima = element.fecha_inicio_ideal
    let fechaInicioCumplimiento = element.fecha_inicio_cumplimiento;
    let fechaInicioCumplimientoFin = element.fecha_inicio_cumplimiento_fin;
    let fechaIdeal = element.fecha_ideal
    const fechaHoy = Date.now()



    if((element.completado === 1 || element.completado === 2) && fechaCumplimiento !== null) {
      if(fechaCumplimiento.toString() === fechaColumna.toString()) return '#ffcc0c'
      if(fechaCumplimiento.toString() <= fechaColumna.toString()) return 'transparent'
    } 

    if(element.completado === 3 && fechaCumplimiento !== null) {
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
    let milis = day.getTime().toString()
    let contador = 0;

    //---------------------------------------------//
    //---------ROJO PARPADEO RAPIDO----------------//
    //---------------------------------------------//
    switch (mode){
      case 1:
        for (const objeto of this.cumplimientos) {
          if((objeto.completado === 1 || objeto.completado === 2 || objeto.completado === 3) && milis >= objeto.fecha_completado) {}
          else if (milis >= objeto.urgent_date_start && milis <= objeto.urgent_date_end) {
            contador++;
          }
        }

        return contador;

      //---------------------------------------------//
      //---------ROJO PARPADEO LENTO-----------------//
      //---------------------------------------------//
      
      case 2:
        for (const objeto of this.cumplimientos) {
          if((objeto.completado === 1 || objeto.completado === 2 || objeto.completado === 3) && milis >= objeto.fecha_completado) {}
          else if (milis >= objeto.close_date_start && milis <= objeto.close_date_end) {
            contador++;
          }
        }

        return contador;

      //---------------------------------------------//
      //-------AMARILLO PARPADEO RAPIDO--------------//
      //---------------------------------------------//
      

      case 3:
        for (const objeto of this.cumplimientos) {
          if((objeto.completado === 1 || objeto.completado === 2 || objeto.completado === 3) && milis >= objeto.fecha_completado) {}
          else if (milis >= objeto.recommended_date_start && milis <= objeto.recommended_date_end) {
            contador++;
          }
        }

        return contador;

      //---------------------------------------------//
      //-------AMARILLO PARPADEO LENTO---------------//
      //---------------------------------------------//
      case 4:
        for (const objeto of this.cumplimientos) {
          if((objeto.completado === 1 || objeto.completado === 2 || objeto.completado === 3) && milis >= objeto.fecha_completado) {}
          else if (milis >= objeto.ideal_date_start && milis <= objeto.ideal_date_end ) {
            contador++;
          }
        }

        return contador;

      //---------------------------------------------//
      //-------------AMARILLO SÓLIDO-----------------//
      //---------------------------------------------//

      case 5:
        for (const objeto of this.cumplimientos) {
          if(objeto.fecha_completado !== '0' && objeto.fecha_completado >= milis && objeto.fecha_completado <=  (parseInt(milis) + 86399999).toString() && (objeto.completado == 1 || objeto.completado == 2)) {
            contador ++;
          }
        }

        return contador;

      //---------------------------------------------//
      //----------------VERDE SÓLIDO-----------------//
      //---------------------------------------------//


      case 6:
        for (const objeto of this.cumplimientos) {
          if(objeto.fecha_completado && (objeto.fecha_completado >= milis && objeto.fecha_completado <= (parseInt(milis) + 86399999).toString()) && objeto.completado == 3) {
            contador ++;
          }
        }

        return contador;

      //---------------------------------------------//
      //----------------ROJO SÓLIDO------------------//
      //---------------------------------------------//

      case 7:
        for (const objeto of this.cumplimientos) {
          if(objeto.completado === 0 && milis > objeto.urgent_date_end && milis <= Date.now().toString())
            contador ++
        }
        return contador
        
      default:
        return 0
    }
  }

  returnUp(){

  }











  exModalData: any = null;

  theCumplimientos = []

  banderaRoja = false
  banderaAmarilla = false
  banderaVerde = false


  modalIsIndicadorLento(element: any, column: any) {
    column = (column.getTime()).toString()
    if (column === 0) return false;
    if(element.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.urgent_date_start;
    let fechaInicioIdeal = element.ideal_date_start;
    let fechaIdealFin = element.close_date_end

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
    if(element.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.urgent_date_start;
    let fechaMaximaFin = element.urgent_date_end
    let fechaInicioCumplimiento = element.recommended_date_start;
    let fechaInicioCumplimientoFin = element.recommended_date_end;

    const DateToday = new Date();
    DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
    DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

    const fechaHoy = DateToday.getTime();

    if(fechaColumna.toString() === fechaMaxima.toString() && element.completado === false) return true

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
    let fechaCumplimiento = element.fecha_completado


    //****NUEVA FORMA****//

    //86399999 son 24 horas menos un milisegundo para evitar conflictos con las fechas
    
    //SI YA FUE COMPELTADA
    if(fechaCumplimiento !== null) {
      //SI ESTA EN REVISION
      if(element.completado === 1 || element.completado === 2){
        if(fechaCumplimiento >= fechaColumna || fechaCumplimiento <= (parseInt(fechaColumna) + 86399999).toString()) return '#ffcc0c' //SI ESTÁ DENTRO DEL RECUADRO
        if(fechaCumplimiento >= (parseInt(fechaColumna) + 86399999).toString()) return 'transparent' //SI ESTÁ MÁS ALLÁ DEL RECUADRO. HACE QUE EL DE FECHA COMPLETADO SEA EL ULTIMO
      }
      //SI YA FUE APROBADA
      if(element.completado === 3) {
        if(fechaCumplimiento >= fechaColumna || fechaCumplimiento <= (parseInt(fechaColumna) + 86399999).toString()) return 'green' // SI NO ESTÁ DENTRO DEL RECUADRO
        if(fechaCumplimiento >= (parseInt(fechaColumna) + 86399999).toString()) return 'transparent' //SI ESTÁ MÁS ALLÁ DEL RECUADRO. HACE QUE EL DE FECHA COMPLETADO SEA EL ULTIMO
      }
    }
    //SI ESTÁ POR DETRAS DE LA FECHA MINIMA
    if(element.ideal_date_start > fechaColumna) return 'transparent'

    //PARA ESTAR EN ROJO
    if(element.urgent_date_end >= fechaColumna && element.close_date_start <= fechaColumna) return 'red'
    //PARA ESTAR EN AMARILLO
    if(element.recommended_date_end >= fechaColumna && element.ideal_date_start <= fechaColumna) return '#ffcc0c'

    return 'transparent'
  }

  modalIsRojorapido(element: any, column: any){
    column = (column.getTime()).toString()
    if(column === 0) return false
    if(element.completado !== 0) return false 

    let fechaColumna = column;

    if(fechaColumna >= element.urgent_date_start && fechaColumna <= element.urgent_date_end) return true
    return false
  }

  modalIsRojoLento(element: any, column: any) {
    column = (column.getTime()).toString()
    if(column === 0) return false
    if(element.completado !== 0) return false 

    let fechaColumna = column;

    if(fechaColumna >= element.close_date_start && fechaColumna <= element.close_date_end) return true
    return false
  }

  modalIsAmarilloRapido(element: any, column: any){
    column = (column.getTime()).toString()
    if(column === 0) return false
    if(element.completado !== 0) return false 

    let fechaColumna = column;

    if(fechaColumna >= element.recommended_date_start && fechaColumna <= element.recommended_date_end) return true
    return false
  }

  modalIsAmarilloLento(element: any, column: any) {
    column = (column.getTime()).toString()
    if(column === 0) return false
    if(element.completado !== 0) return false 

    let fechaColumna = column;

    if(fechaColumna >= element.ideal_date_start && fechaColumna <= element.ideal_date_end) return true
    return false
  }

  modalIsAmarilloFijo(element: any, column: any) {
    column = (column.getTime()).toString()
    if (column === 0) return false;
    let completado = element.completado

    if (column > element.fecha_completado || column <= element.ideal_date_start) return false

    if (completado === 1 || completado === 2) return true
    else return false
  }

  modalIsVerde(element: any, column: any): boolean {
    column = (column.getTime()).toString()
    if (column === 0) {
      return false;
    }
    let fechaColumna = column;
    let fechaCumplimiento = element.fecha_completado

    if(fechaColumna > fechaCumplimiento && fechaColumna < (parseInt(fechaColumna) + 86399999).toString && element.completado === 3) return true

  }

  filterCumplimientos(){
    this.theCumplimientos = []
    let milis = (this.exModalData.date.getTime()).toString()

    for (const cumplimiento of this.exModalData.cumplimientos) {
      if (milis >= cumplimiento.ideal_date_start && milis <= cumplimiento.urgent_date_end) {
        this.theCumplimientos.push(cumplimiento)
      }
    }
  }

  scrollToBottom(): void {
    this.scrollPending = true;
  }

  scrollToTop(): void {
    this.scrollToTopPending = true;
  }

  hoverTimer: any;

  async startHoverTimer(mode:number) {
    this.hoverTimer = setTimeout(async () => {
      this.overrideBackup(mode)
    }, 2500); // 2500 ms = 2.5 segundos
  }

  clearHoverTimer() {
    clearTimeout(this.hoverTimer);
    this.cumplimientos.forEach((element, index) => {
      this.cumplimientos[index].obligations.respaldo =''
    })
  }

  overrideBackup(index:number){
    this.cumplimientos[index].obligations.respaldo = this.cumplimientos[index].obligations.descripcion
    this.cdr.detectChanges();
  }
}