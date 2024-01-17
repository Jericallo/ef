import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, "es");

@Component({
  selector: 'app-detail-day',
  templateUrl: './detail-day.component.html',
  styleUrls: ['./detail-day.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: "es" }],
})
export class DetailDayComponent implements OnInit {
  showMainSpinner = false
  constructor(public apiService: ApiService, public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any ) { }

  cumplimientos = []

  ngOnInit(): void {
    console.log(this.data)
    this.filterDays()
  }

  filterDays(){
    const fechaHoy = Date.now()
    if(fechaHoy < this.data.date) return
    this.cumplimientos = this.data.data.filter(cumplimiento => {
      return (cumplimiento.cumplimientos_obligacion.completado == false || 
        (cumplimiento.cumplimientos_obligacion.completado === true && cumplimiento.cumplimientos_obligacion.fecha_cumplimiento >= this.data.date))
    })
  }

  isFechaMaxima(element: any, column: number): string {
    let fechaColumna = this.data.date;;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    const fechaHoy = Date.now()

    if(fechaMaxima.toString() > fechaColumna.toString()) {
      if(fechaColumna.toString() > fechaHoy.toString()) return 'transparent'
      else return '#ffcc0c'
    } else if(fechaMaxima.toString() === fechaColumna.toString()) {
      if(element.cumplimientos_obligacion.completado === true) return 'green'
      if(fechaHoy < fechaColumna) return 'transparent'
      else return '#ffcc0c'
    } else if(fechaMaxima.toString() < fechaColumna.toString()) {
      if(fechaColumna.toString() > fechaHoy.toString()) return 'transparent'
      if(element.cumplimientos_obligacion.completado === false) return 'red'
      else return 'transparent'
    }
  }
}
