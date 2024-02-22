import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-traffic-light',
  templateUrl: './traffic-light.component.html',
  styleUrls: ['./traffic-light.component.scss']
})
export class TrafficLightComponent implements OnInit {

  horaActual: string

  constructor() { }

  ngOnInit(): void {
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

}
