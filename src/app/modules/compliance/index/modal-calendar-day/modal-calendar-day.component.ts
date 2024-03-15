import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-calendar-day',
  templateUrl: './modal-calendar-day.component.html',
  styleUrls: ['./modal-calendar-day.component.scss']
})
export class ModalCalendarDayComponent implements OnInit {

  theCumplimientos = []

  constructor( @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)
    this.filterCumplimientos()
  }

  filterCumplimientos(){
    let milis = (this.data.date.getTime()).toString()

    for (const cumplimiento of this.data.cumplimientos) {
      if (milis >= cumplimiento.cumplimientos_obligacion.fecha_inicio_ideal && milis <= cumplimiento.cumplimientos_obligacion.fecha_maxima_fin) {
        this.theCumplimientos.push(cumplimiento)
      }
    }
    console.log(this.theCumplimientos)
  }

  isIndicadorLento(element: any, column: any) {
    column = (column.getTime()).toString()
    if (column === 0) return false;
    if(element.cumplimientos_obligacion.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaInicioIdeal = element.cumplimientos_obligacion.fecha_inicio_ideal;
    let fechaInicioIdealFin = element.cumplimientos_obligacion.fecha_inicio_ideal_fin;
    let fechaIdeal = element.cumplimientos_obligacion.fecha_ideal
    let fechaIdealFin = element.cumplimientos_obligacion.fecha_ideal_fin

    const DateToday = new Date();
    DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
    DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

    const fechaHoy = DateToday.getTime();
    
    if (
        fechaColumna.toString() <= fechaMaxima.toString() &&
        //fechaColumna.toString() >= fechaHoy.toString() &&
        (fechaColumna >= fechaInicioIdeal && fechaColumna <= fechaIdealFin)
    ) {
        return true;
    }

    return false;
}

  isIndicadorRapido(element: any, column: any){
    column = (column.getTime()).toString()
    if(column === 0) return false
    if(element.cumplimientos_obligacion.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaMaximaFin = element.cumplimientos_obligacion.fecha_maxima_fin
    let fechaInicioCumplimiento = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
    let fechaInicioCumplimientoFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;

    const DateToday = new Date();
    DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
    DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

    const fechaHoy = DateToday.getTime();

    if(fechaColumna.toString() === fechaMaxima.toString() && element.cumplimientos_obligacion.completado === false) return true

    if(fechaColumna.toString() <= fechaMaximaFin.toString() ){
     if(fechaColumna >= fechaInicioCumplimiento && fechaColumna <= fechaInicioCumplimientoFin) return true
      if(fechaColumna >= fechaMaxima && fechaColumna <= fechaMaximaFin) return true
    }
    return false
  }

  isFechaMaxima(element: any, column: any): string {
    column = (column.getTime()).toString()
    if (column === 0) {
      return 'transparent';
    }
    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima_fin;
    let fechaCumplimiento = element.cumplimientos_obligacion.fecha_cumplimiento
    let fechaMinima = element.cumplimientos_obligacion.fecha_inicio_ideal
    let fechaInicioCumplimiento = element.cumplimientos_obligacion.fecha_inicio_cumplimiento;
    let fechaInicioCumplimientoFin = element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin;
    let fechaIdeal = element.cumplimientos_obligacion.fecha_ideal
    const fechaHoy = Date.now()



    if((element.cumplimientos_obligacion.completado === 1 || element.cumplimientos_obligacion.completado === 2) && fechaCumplimiento !== null) {
      if(fechaCumplimiento.toString() === fechaColumna.toString()) return '#ffcc0c'
      if(fechaCumplimiento.toString() <= fechaColumna.toString()) return 'transparent'
    } 

    if(element.cumplimientos_obligacion.completado === 3 && fechaCumplimiento !== null) {
      if(fechaCumplimiento.toString() === fechaColumna.toString()) return 'green'
      if(fechaCumplimiento.toString() <= fechaColumna.toString()) return 'transparent'
    } 
    
    if(fechaMinima.toString() > fechaColumna.toString()) return 'transparent'

    if(fechaMaxima.toString() > fechaColumna.toString()) {
      if(fechaColumna.toString() >= (fechaIdeal).toString()) return 'red'
      else return '#ffcc0c'
    } else if(fechaMaxima.toString() === fechaColumna.toString()) return 'red'
     else if(fechaMaxima.toString() < fechaColumna.toString()) return 'transparent'
  }

}
