import { Component, OnInit } from '@angular/core';
import { addDays, addMonths } from 'date-fns';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss']
})
export class RegisterClientComponent implements OnInit {

  dateRange: number[] = [];
  tableData: any[] = []; 

  displayedColumns: any[] = ['nombre'];

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.generateDateRange();
    this.getCompliance();
  }

  generateDateRange(): void {
    const currentDate = new Date();
    currentDate.setDate(1); // Establecer el día al 1 del mes actual
    currentDate.setHours(0, 0, 0, 0);
  
    // Obtener el último día del mes actual
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    lastDayOfMonth.setHours(0,0,0,0);
  
    let current = currentDate;
  
    while (current <= lastDayOfMonth) {
      this.dateRange.push(current.getTime());
      current = addDays(current, 1);
    }
  
    this.displayedColumns = ['nombre', ...this.dateRange.map(date => this.formatDateInSpanish(date))];
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
