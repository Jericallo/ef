import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { addDays, addMonths, format, isSameMonth } from 'date-fns';
import { ApiService } from 'src/app/shared/services/api.service';
import { es } from 'date-fns/locale';  
import { MatDialog} from '@angular/material/dialog';
import { DetailDayComponent } from './detail-day/detail-day.component';
import { DetailCumplimientoComponent } from './detail-cumplimiento/detail-cumplimiento.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss']
})
export class RegisterClientComponent implements OnInit {
  dateRange: number[] = [];
  tableData: any[] = [];
  displayedColumns: any[] = ['nombre'];
  currentMonth: Date;
  cumplimientos_faltantes = false

  hoverTimer: any;
  unhoverTimer:any;
  showTooltip = false
  showChatButton = false

  openChat = false;

  constructor(private apiService: ApiService, public dialogRef: MatDialog) {}

  ngOnInit(): void {
    this.generateDateRange();
    this.getCompliance();

    
  }

  generateDateRange(): void {
    this.currentMonth = new Date();
    this.currentMonth.setDate(1);
    this.currentMonth.setHours(0, 0, 0, 0);

    this.updateDateRange();
    this.cumplimientos_faltantes = this.updateCumplimientosFaltantes()
  }

  updateCumplimientosFaltantes():boolean{
    let params = new HttpParams().set('where',this.currentMonth.getTime())
    this.apiService.getCumplimientosControl(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        res.result.forEach((element)=>{
          if(element.cumplimientos_obligacion.completado === false) return true
          console.log('a')
        })
      }
    });
    return true
  }

  updateDateRange(): void {
    const lastDayOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);

    let current = this.currentMonth;
    this.dateRange = [];

    while (current <= lastDayOfMonth) {
      this.dateRange.push(current.getTime());
      current = addDays(current, 1);
    }

    this.displayedColumns = ['nombre', ...this.dateRange.map(date => this.formatDateInSpanish(date))];
  }

  getCurrentMonthText(): string {
    const currentMonthText = format(this.currentMonth, 'MMMM / yy', { locale: es });
    const today = new Date();

    if (isSameMonth(this.currentMonth, today)) {
    }

    return currentMonthText.charAt(0).toUpperCase() + currentMonthText.slice(1);
  }

  navigateMonth(offset: number): void {
    this.currentMonth = addMonths(this.currentMonth, offset);
    this.updateDateRange();
    this.getCompliance();
    this.cumplimientos_faltantes = this.updateCumplimientosFaltantes()
  }

  formatDateInSpanish(date: number): string {
    return date.toString()
  }

  getCompliance(): void {
    this.apiService.getCumplimientosControl().subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        console.log(res.result)
        this.tableData = res.result;
      }
    });
  }

  //ORDEN DE LAS FECHAS

  //1.- FECHA INICIO IDEAL / FECHA INICIO IDEAL FIN
  //2.- FECHA INICIO CUMPLIMIENTO / FECHA INICIO CUMPLIMIENTO FIN
  //3.- FECHA IDEAL / FECHA IDEAL FIN
  //4.- FECHA MÁXIMA / FECHA MÁXIMA FIN

  isFechaMaxima(element: any, column: number): string {
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

  isColumn(column : any, element : any){
    if(column === 'nombre') return '#ffcc0c'

    let date = new Date(parseInt(column))
    let today = new Date()

    if(date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) return '#fff1bd'
    else return 'transparent'
  }

  openDayDialog(column:any){
    const dialogRef = this.dialogRef.open(DetailDayComponent, { 
      width: '1000px',
      height: '720px',
      data: {date: column, data:this.tableData}
    });
  }

  openCumplimientoDialog(cumplimiento:any, day:any){
    this.clearHoverTimer()
    const user = this.apiService.getWholeUser()

    if(user.nombre_perfil !== 'Supervisor'){
      if(cumplimiento.cumplimientos_obligacion.completado !== 0) return
      if(day > cumplimiento.cumplimientos_obligacion.fecha_maxima_fin || day < cumplimiento.cumplimientos_obligacion.fecha_inicio_ideal) return
    }

    const dialogRef = this.dialogRef.open(DetailCumplimientoComponent, { 
      width: '800px',
      height: '170px',
      data: {cumplimiento:cumplimiento, fecha:day} 
    });

    dialogRef.afterClosed().subscribe(result => {
      this.getCompliance()
    });
  }

  isIndicadorLento(element: any, column: any) {
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

  isIndicadorRapido(element: any, column: number){
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

  messageTooltip(element:any, column:number){
    this.showChatButton = false
    let fechaColumna = column;
    
    let fechaInicioCumplimientoIdeal = element.cumplimientos_obligacion.fecha_inicio_ideal;
    let fechaInicioCumplimientoIdealFin = element.cumplimientos_obligacion.fecha_inicio_ideal_fin;

    let fechaInicio = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
    let fechaInicioFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;

    let fechaIdeal = element.cumplimientos_obligacion.fecha_ideal;
    let fechaIdealFin = element.cumplimientos_obligacion.fecha_ideal_fin;

    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaMaximaFin = element.cumplimientos_obligacion.fecha_maxima_fin;
    
    if(fechaColumna < fechaInicioCumplimientoIdeal) return 'Nada que revisar'

    if(element.cumplimientos_obligacion.fecha_cumplimiento !== null){
      let fecha_completado = element.cumplimientos_obligacion.fecha_cumplimiento

      if(fechaColumna > fecha_completado && element.cumplimientos_obligacion.completado === 3) return 'Cumplimiento realizado.'
      

      if(element.cumplimientos_obligacion.completado === 3)return 'Cumplimiento totalmente realizado. El supervisor ya dio el visto bueno a la evidencia del cumplimiento.'
      if(element.cumplimientos_obligacion.completado === 2 || element.cumplimientos_obligacion.completado === 1){
        if(parseInt(fecha_completado) + 86400000 < Date.now()){ 
          this.showChatButton = true
          return 'El usuario indico que ya realizo el cumplimiento. El supervisor aún no contesta, favor de contactarlo de inmediato.'; 
        } 
        else return 'El usuario indico que ya realizo el cumplimiento. Pendiente que el supervisor reciba y de su visto bueno a la evidencia del cumplimiento.'
      }
      if(fechaColumna > fecha_completado && (element.cumplimientos_obligacion.completado === 1 || element.cumplimientos_obligacion.completado === 2))return 'Cumplimiento aun no realizado'
      
    }


    if(fechaColumna > fechaMaximaFin && element.cumplimientos_obligacion.completado === 0)return 'Cumplimiento aun no realizado'
    
    if(fechaColumna >= fechaInicioCumplimientoIdeal && fechaColumna < fechaInicioCumplimientoIdealFin) return 'Periodo ideal para iniciar el cumplimiento'
    if(fechaColumna >= fechaInicio && fechaColumna < fechaInicioFin) return 'Periodo ideal para terminar el cumplimiento'
    if(fechaColumna >= fechaIdeal && fechaColumna < fechaIdealFin) return 'Periodo para cumplirlo con vencimiento próximo'
    if(fechaColumna >= fechaMaxima && fechaColumna < fechaMaximaFin) return 'Periodo para cumplirlo muy urgente'
  }

  startHoverTimer(element: any, column: number) {
    this.hoverTimer = setTimeout(() => {
        this.prueba(element, column);
    }, 2500); // 2500 ms = 2.5 segundos
  }

  clearHoverTimer() {
    console.log(this.showTooltip)
    if(this.showTooltip){
      this.clearAll()
    } else {
      clearTimeout(this.hoverTimer);
      clearTimeout(this.unhoverTimer);
    }
  }

  prueba(element:any, column:number) {
    clearTimeout(this.hoverTimer);
    clearTimeout(this.unhoverTimer);
    const id = element.cumplimientos_obligacion.id_obligacion
    var sections = document.querySelectorAll('.custom-tooltip');
    for (let i = 0; i < sections.length; i++){
      sections[i].classList.remove('show');
    }
    document.querySelector(`#tooltip-${id}-${column}`).classList.add('show');
    this.showTooltip = true
  }

  clearAll() {
    console.log('Clearing...')
    this.unhoverTimer = setTimeout(() => {
      console.log('Cleared')
      var sections = document.querySelectorAll('.custom-tooltip');
      for (let i = 0; i < sections.length; i++){
        sections[i].classList.remove('show');
      }
      this.showTooltip = false
    }, 2500); // 2500 ms = 2.5 segundos
  }

  openChatDirective(){
    this.openChat = true
  }
}
