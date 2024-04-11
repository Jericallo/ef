import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
import { addDays, addMonths, format, isSameMonth } from 'date-fns';
import { ApiService } from 'src/app/shared/services/api.service';
import { es } from 'date-fns/locale';  
import { MatDialog} from '@angular/material/dialog';
import { DetailDayComponent } from './detail-day/detail-day.component';
import { DetailCumplimientoComponent } from './detail-cumplimiento/detail-cumplimiento.component';
import { HttpParams } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss']
})
export class RegisterClientComponent implements OnInit, AfterViewInit {
  dateRange: number[] = [];
  tableData: any[] = [];
  displayedColumns: any[] = ['nombre', 'descripcion'];
  currentMonth: Date;
  cumplimientos_faltantes = false

  hoverTimer: any;
  unhoverTimer:any;
  showTooltip = false
  showChatButton = false
  sendableDate: Date = new Date();

  openChat = false;

  @ViewChildren('tooltip') tooltips: QueryList<ElementRef>;
  private tooltipSubscription: Subscription;

  constructor(private apiService: ApiService, public dialogRef: MatDialog, private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.generateDateRange();
    this.getCompliance();
  }

  ngAfterViewInit(): void {
    // Observador de mutaciones para detectar cuando los elementos están listos
    const observer = new MutationObserver(() => {
      this.adjustAllTooltipsPosition();
    });

    // Observar cambios en el elemento padre
    observer.observe(this.elementRef.nativeElement, { childList: true, subtree: true });
  }

  ngOnDestroy(): void {
    if (this.tooltipSubscription) {
      this.tooltipSubscription.unsubscribe();
    }
  }

  adjustAllTooltipsPosition() {
    const tooltipsArray = this.tooltips.toArray();
    tooltipsArray.forEach(tooltipRef => {
      const tooltip = tooltipRef.nativeElement;
      const rect = tooltip.getBoundingClientRect();
      const windowWidth = window.innerWidth;

      // Verificar si el tooltip está demasiado cerca del borde derecho
      if (rect.right > windowWidth) {
          tooltip.style.left = `auto`;
          tooltip.style.right = `0`;
      } else {
          tooltip.style.right = `auto`;
          tooltip.style.left = `50%`;
          tooltip.style.transform = `translateX(-50%)`;
      }
    });
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
          if(element.completado === false) return true
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
    if( offset > 0 ) this.sendableDate.setMonth(this.sendableDate.getMonth()+1)
    else this.sendableDate.setMonth(this.sendableDate.getMonth()-1)
    this.currentMonth = addMonths(this.currentMonth, offset);
    this.updateDateRange();
    this.getCompliance();
    this.cumplimientos_faltantes = this.updateCumplimientosFaltantes()
  }

  formatDateInSpanish(date: number): string {
    return date.toString()
  }

  getCompliance(): void {

    let date = new Date(this.sendableDate), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    this.apiService.getCumplimientos(firstDay.getTime(), lastDay.getTime()).subscribe({
      next: res => {
        this.tableData = res;
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
    let fechaMaxima = element.urgent_date_end;
    let fechaCumplimiento = element.fecha_completado
    let fechaMinima = element.ideal_date_start
    let fechaIdeal = element.close_date_start

    const fechaHoy = new Date().getTime()

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
     else if(fechaMaxima.toString() < fechaColumna.toString() && fechaColumna.toString() <= fechaHoy.toString()) return 'red'
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

    console.log(user)

    if(user.nombre_perfil !== 'Supervisor'){
      if(cumplimiento.completado !== 0) return
      //if(day > cumplimiento.urgent_date_end || day < cumplimiento.ideal_date_start) return
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
    if(element.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.urgent_date_start;
    let fechaInicioIdeal = element.ideal_date_start;
    let fechaIdealFin = element.close_date_end

    const DateToday = new Date();
    DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
    DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo
    
    if (
        fechaColumna.toString() <= fechaMaxima.toString() &&
        (fechaColumna >= fechaInicioIdeal && fechaColumna <= fechaIdealFin)
    ) {
        return true;
    }

    return false;
}

  isIndicadorRapido(element: any, column: number){
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

    if(fechaColumna.toString() === fechaMaxima.toString() && element.completado === false) return true

    if(fechaColumna.toString() <= fechaMaximaFin.toString() ){
     if(fechaColumna >= fechaInicioCumplimiento && fechaColumna <= fechaInicioCumplimientoFin) return true
      if(fechaColumna >= fechaMaxima && fechaColumna <= fechaMaximaFin) return true
    }
    return false
  }

  messageTooltip(element:any, column:number){
    this.showChatButton = false
    let fechaColumna = column;
    
    let fechaInicioCumplimientoIdeal = element.ideal_date_start;
    let fechaInicioCumplimientoIdealFin = element.ideal_date_end;

    let fechaInicio = element.recommended_date_start;
    let fechaInicioFin = element.recommended_date_end;

    let fechaIdeal = element.close_date_start;
    let fechaIdealFin = element.close_date_end;

    let fechaMaxima = element.urgent_date_start;
    let fechaMaximaFin = element.urgent_date_end;
    
    if(fechaColumna < fechaInicioCumplimientoIdeal) return 'Nada que revisar'

    if(element.fecha_completado !== null){
      let fecha_completado = element.fecha_completado

      if(fechaColumna > fecha_completado && element.completado === 3) return 'Cumplimiento realizado.'
      

      if(element.completado === 3)return 'Cumplimiento totalmente realizado. El supervisor ya dio el visto bueno a la evidencia del cumplimiento.'
      if(element.completado === 2 || element.completado === 1){
        if(parseInt(fecha_completado) + 86400000 < Date.now()){ 
          this.showChatButton = true
          return 'El usuario indico que ya realizo el cumplimiento. El supervisor aún no contesta, favor de contactarlo de inmediato.'; 
        } 
        else return 'El usuario indico que ya realizo el cumplimiento. Pendiente que el supervisor reciba y de su visto bueno a la evidencia del cumplimiento.'
      }
      if(fechaColumna > fecha_completado && (element.completado === 1 || element.completado === 2))return 'Cumplimiento aun no realizado'
      
    }


    if(fechaColumna > fechaMaximaFin && element.completado === 0)return 'Cumplimiento aun no realizado'
    
    if(fechaColumna >= fechaInicioCumplimientoIdeal && fechaColumna < fechaInicioCumplimientoIdealFin) return 'Periodo ideal para iniciar el cumplimiento'
    if(fechaColumna >= fechaInicio && fechaColumna < fechaInicioFin) return 'Periodo ideal para terminar el cumplimiento'
    if(fechaColumna >= fechaIdeal && fechaColumna < fechaIdealFin) return 'Periodo para cumplirlo con vencimiento próximo'
    if(fechaColumna >= fechaMaxima && fechaColumna <= fechaMaximaFin) return 'Periodo para cumplirlo muy urgente'
  }

  startHoverTimer(element: any, column: number) {
    this.hoverTimer = setTimeout(() => {
        this.prueba(element, column);
    }, 2500); // 2500 ms = 2.5 segundos
  }

  clearHoverTimer() {
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

    const cadena = column.toString()

    const fechaColumn = new Date(parseInt(cadena));
    const fechaHoy = new Date();
    if (
        fechaColumn.getFullYear() === fechaHoy.getFullYear() &&
        fechaColumn.getMonth() === fechaHoy.getMonth() &&
        fechaColumn.getDate() === fechaHoy.getDate()
    ) {
        this.openCumplimientoDialog(element,column)
    } else {
      const id = element.id
      var sections = document.querySelectorAll('.custom-tooltip');
      for (let i = 0; i < sections.length; i++){
        sections[i].classList.remove('show');
      }
      document.querySelector(`#tooltip-${id}-${column}`).classList.add('show');
      this.showTooltip = true
    }
    }


    
    

  clearAll() {
    console.log('Clearing...')
    this.unhoverTimer = setTimeout(() => {
      console.log('Cleared')
      let sections = document.querySelectorAll('.custom-tooltip');
      for (let i = 0; i < sections.length; i++){
        sections[i].classList.remove('show');
      }
      sections = document.querySelectorAll('.custom-tooltip-column');
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
