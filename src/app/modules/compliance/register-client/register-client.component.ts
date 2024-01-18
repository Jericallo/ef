import { Component, OnInit } from '@angular/core';
import { addDays, addMonths, format, isSameMonth } from 'date-fns';
import { ApiService } from 'src/app/shared/services/api.service';
import { es } from 'date-fns/locale';  
import { MatDialog} from '@angular/material/dialog';
import { DetailDayComponent } from './detail-day/detail-day.component';

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
    const currentMonthText = format(this.currentMonth, 'MMMM yyyy', { locale: es });
    const today = new Date();

    if (isSameMonth(this.currentMonth, today)) {
      return 'Mes actual'; // or any other customized text
    }

    return currentMonthText.charAt(0).toUpperCase() + currentMonthText.slice(1);
  }

  navigateMonth(offset: number): void {
    this.currentMonth = addMonths(this.currentMonth, offset);
    this.updateDateRange();
    this.getCompliance();
  }
  
  

  formatDateInSpanish(date: number): string {
    return date.toString()
  }

  getCompliance(): void {
    this.apiService.getCumplimientosControl().subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        this.tableData = res.result;
        console.log(this.tableData)
      }
    });
  }

  //86,400,000

  isFechaMaxima(element: any, column: number): string {
    if (column === 0) {
      return 'transparent';
    }
    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaCumplimiento = element.cumplimientos_obligacion.fecha_cumplimiento
    const fechaHoy = Date.now()

    if(element.cumplimientos_obligacion.completado === true && fechaCumplimiento.toString() === fechaColumna.toString()) return 'green'

    if(fechaMaxima.toString() > fechaColumna.toString()) {
      if(fechaColumna.toString() >= (fechaMaxima - (86400000 * 11)).toString()) return 'red'
      else return '#ffcc0c'
    } else if(fechaMaxima.toString() === fechaColumna.toString()) return 'red'
     else if(fechaMaxima.toString() < fechaColumna.toString()) return 'transparent'
  }

  isColumn(column : any, element : any){
    if(column === 'nombre') return '#ffcc0c'

    let date = new Date(parseInt(column))
    let today = new Date()

    console.log(date, today)
    if(date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) return '#fff1bd'
    else return 'transparent'
  }

  openDayDialog(column:any){
    const dialogRef = this.dialogRef.open(DetailDayComponent, { 
      width: '1000px',
      height: '720px',
      data: {date: column, data:this.tableData} // Puedes pasar los datos del evento al diálogo a través de la propiedad 'data'
    });
  }

  isIndicadorLento(element: any, column: any){
    if(column === 0) return false
    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;

    const fechaHoy = Date.now()

    if(fechaColumna.toString() < fechaMaxima.toString() && fechaColumna.toString() >= fechaHoy.toString()){
      if((fechaMaxima - (86400000 * 7)).toString() > fechaColumna.toString()) return true
    }

    return false
  }

  isIndicadorRapido(element: any, column: number){
    if(column === 0) return false
    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;

    const fechaHoy = Date.now()

    if(fechaColumna.toString() === fechaMaxima.toString() && element.cumplimientos_obligacion.completado === false && fechaColumna.toString() >= fechaHoy.toString()) return true

    if(fechaColumna.toString() < fechaMaxima.toString() && fechaColumna.toString() > fechaHoy.toString()){
      if((fechaMaxima - (86400000 * 8)).toString() < fechaColumna.toString()) return true
    }

    return false
  }
}
