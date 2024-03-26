import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDataService } from '../modal-data.service';

@Component({
  selector: 'app-modal-calendar-day',
  templateUrl: './modal-calendar-day.component.html',
  styleUrls: ['./modal-calendar-day.component.scss']
})
export class ModalCalendarDayComponent implements OnInit {

  data: any;

  theCumplimientos = []

  banderaRoja = false
  banderaAmarilla = false
  banderaVerde = false

  constructor( private modalDataService: ModalDataService,) { }

  ngOnInit(): void {
    this.modalDataService.data$.subscribe(data => {
      this.data = data;
    });
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

  modalIsIndicadorLento(element: any, column: any) {
    column = (column.getTime()).toString()
    if (column === 0) return false;
    if(element.cumplimientos_obligacion.completado !== 0) return false 

    let fechaColumna = column;
    let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
    let fechaInicioIdeal = element.cumplimientos_obligacion.fecha_inicio_ideal;
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

  modalIsIndicadorRapido(element: any, column: any){
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

  modalIsFechaMaxima(element: any, column: any): string {
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

  modalIsRojorapido(element: any, column: any){
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

    if(fechaColumna.toString() === fechaMaxima.toString() && element.cumplimientos_obligacion.completado === false) {this.banderaRoja = true; return true}

    if(fechaColumna.toString() <= fechaMaximaFin.toString() ){
      if(fechaColumna >= fechaMaxima && fechaColumna <= fechaMaximaFin) return true
    }
    return false
  }

  modalIsRojoLento(element: any, column: any) {
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
        (fechaColumna >= fechaIdeal && fechaColumna <= fechaIdealFin)
    ) {
      this.banderaRoja = true
        return true;
    }

    return false;
}

modalIsAmarilloRapido(element: any, column: any){
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
   if(fechaColumna >= fechaInicioCumplimiento && fechaColumna <= fechaInicioCumplimientoFin) {this.banderaAmarilla = true; return true}
  }
  return false
}

modalIsAmarilloLento(element: any, column: any) {
  column = (column.getTime()).toString()
  if (column === 0) return false;
  if(element.cumplimientos_obligacion.completado !== 0) return false 

  let fechaColumna = column;
  let fechaMaxima = element.cumplimientos_obligacion.fecha_maxima;
  let fechaInicioIdeal = element.cumplimientos_obligacion.fecha_inicio_ideal;
  let fechaInicioIdealFin = element.cumplimientos_obligacion.fecha_inicio_ideal_fin;


  const DateToday = new Date();
  DateToday.setHours(0, 0, 0, 0); // Establecer a las 00:00:00
  DateToday.setTime(DateToday.getTime() - 1); // Restar un milisegundo

  const fechaHoy = DateToday.getTime();
  
  if (
      fechaColumna.toString() <= fechaMaxima.toString() &&
      //fechaColumna.toString() >= fechaHoy.toString() &&
      (fechaColumna >= fechaInicioIdeal && fechaColumna <= fechaInicioIdealFin)
  ) {
    this.banderaAmarilla = true
      return true;
  }

  return false;
}

modalIsAmarilloFijo(element: any, column: any) {
  column = (column.getTime()).toString()
  if (column === 0) return false;

  let fechaCumplimiento = element.cumplimientos_obligacion.fecha_cumplimiento
  let completado = element.cumplimientos_obligacion.completado

  if (column > fechaCumplimiento) return false

  if (completado === 1 || completado === 2) return true
  else return false
}

modalIsVerde(element: any, column: any): boolean {
  column = (column.getTime()).toString()
  if (column === 0) {
    return false;
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
    if(fechaCumplimiento.toString() === fechaColumna.toString()) return false
    if(fechaCumplimiento.toString() <= fechaColumna.toString()) return false
  } 

  if(element.cumplimientos_obligacion.completado === 3 && fechaCumplimiento !== null) {
    if(fechaCumplimiento.toString() === fechaColumna.toString()) {this.banderaVerde = true; return true}
    if(fechaCumplimiento.toString() <= fechaColumna.toString()) return false
  } 
  
  if(fechaMinima.toString() > fechaColumna.toString()) return false

  if(fechaMaxima.toString() > fechaColumna.toString()) {
    if(fechaColumna.toString() >= (fechaIdeal).toString()) return false
    else return false
  } else if(fechaMaxima.toString() === fechaColumna.toString()) return false
   else if(fechaMaxima.toString() < fechaColumna.toString()) return false
}
}
