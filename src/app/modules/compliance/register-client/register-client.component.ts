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
    currentDate.setHours(0, 0, 0, 0); 
  
    const endDate = addDays(addMonths(currentDate, 1), 0);
  
    let current = currentDate;
  
    while (current <= endDate) {
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
