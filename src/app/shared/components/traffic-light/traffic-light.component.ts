import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss']
})
export class TrafficLightComponent implements OnInit, OnChanges {

  @Input() datosActualizados: any = [];

  horaActual: string
  sendableDate: Date = new Date();
  percentage: number = 0

  constructor( public apiService: ApiService) { }

  ngOnInit(): void {
    this.getCumplimientos()
    setInterval(() => {
      this.actualizarHora();
    }, 1000);
  }

  actualizarHora() {
    const ahora = new Date();
    let horas = ahora.getHours();
    const minutos = ahora.getMinutes();
    const am_pm = horas >= 12 ? 'p.m.' : 'a.m.';
    horas = horas % 12;
    horas = horas ? horas : 12; // Ajustar 0 a 12
    // Formatear la hora como deseado (en este caso, hh:mm a.m./p.m.)
    this.horaActual = horas.toString().padStart(2, '0') + ':' +
                      minutos.toString().padStart(2, '0') + ' ' +
                      am_pm;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.datosActualizados){
      this.getCumplimientos();
    }
  }

  getCumplimientos(){
    let date = new Date(this.sendableDate), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);

    this.apiService.getCumplimientos(firstDay.getTime(), lastDay.getTime()).subscribe({
      next: res => {
        console.log(res.tasks)
        const total = res.tasks.length
        const compeltedTasks = res.tasks.filter((obj:any) => obj.completado !== 0)
        const totalCompleted = compeltedTasks.length
        console.log(total, totalCompleted, (totalCompleted * 100) / total)

        this.percentage = parseFloat(((totalCompleted * 100) / total).toFixed(2))
      }
    });
  }

}
