import { Component, OnInit } from '@angular/core';
import { addDays, addMonths, format, isSameMonth } from 'date-fns';
import { ApiService } from 'src/app/shared/services/api.service';
import { es } from 'date-fns/locale';  

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

  constructor(private apiService: ApiService) {}

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

  isFechaMaxima(element: any, column: number): boolean {
    if (column === 0) {
      return false;
    }

    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
  
    return fechaMaxima.toString() === fechaColumna.toString();
  }
}
