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

  constructor(private apiService:ApiService) { }

  ngOnInit(): void {
    this.getObligations()
  }

  getObligations() {
    const date = new Date();
    let params = new HttpParams().set("day", date.getTime() / 60000);

    this.apiService.dates(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        if (Array.isArray(res.result)) {
          const currentDate = Date.now() // Get the current date and time
          this.events = res.result.flatMap(obligation => {
            console.log(obligation)
            obligation.fecha_inicio = (obligation.fecha_inicio * 60000)
            console.log('obligation:',obligation)
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
            return [
              ...alerts,

              {
                start: new Date(obligation.fecha_inicio),
                end: new Date(obligation.fecha_inicio),
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

}
