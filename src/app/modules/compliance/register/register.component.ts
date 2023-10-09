import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import {CalendarEvent,CalendarEventAction,CalendarEventTimesChangedEvent,CalendarView} from 'angular-calendar';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  events: CalendarEvent[] = [    
  ];

  data: any[][] = [];

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

  mes=''
  anio=''

  dataSource: any[];
  displayedColumns: string[];
  fixedColumns: string[];

  constructor(private apiService:ApiService) {}

  ngOnInit(): void {
    this.getObligations()

    const month = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const d = new Date()
    this.mes = month[d.getMonth()]
    this.anio = d.getFullYear().toString()

    console.log(this.dataSource)
  }

  getObligations() {
    const date = new Date();
    let params = new HttpParams().set("day", date.getTime() / 60000);
    params.append('id_usuario', this.apiService.getId())
    this.apiService.getCumplimientos().subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        console.log(res.result)

        this.dataSource = [];
        this.displayedColumns = [];
        this.fixedColumns = ['fixedColumn','fixedColumn2','fixedColumn3'];

        for (let i = 1; i <= 50; i++) {
          const columnName = `Column ${i}`;
          this.displayedColumns.push(columnName);
          this.fixedColumns.push(columnName);
        }
        this.fixedColumns.push('fixedColumn4')

        for (let i = 1; i <= 500; i++) {
          const row = { fixedColumn: `Row ${i}`,fixedColumn2: `Rowf ${i}`,fixedColumn3: `Rowff ${i}` };
          for (let j = 1; j <= 50; j++) {
            const columnName = `Column ${j}`;
            row[columnName] = `${columnName} - Row ${i}`;
          }
          row['switch'] = true
          row['textColor'] = 'black'

          this.dataSource.push(row);
        }

        res.result.forEach((element,index) => {
          this.dataSource[index].fixedColumn = element.descripcion
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  onSwitchChange(row: any) {
    row.switch
    if (!row.switch) {
      row.textColor = 'white'; // Establece el contenido en blanco
    } else {
      row.textColor = 'black';
    }
  }

}
