import { Component, Inject, OnInit, LOCALE_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, "es");

@Component({
  selector: 'app-detail-cumplimiento',
  templateUrl: './detail-cumplimiento.component.html',
  styleUrls: ['./detail-cumplimiento.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: "es" }],
})
export class DetailCumplimientoComponent implements OnInit {
  disabled = false
  texto = "Marcar como cumplido"
  showButton = true
  mostrarLeyenda = false

  blanco = true;
  mensaje_blanco = "Nada por revisar este día."

  color = 'transparent'

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit(): void {
    if((this.data.cumplimiento.cumplimientos_obligacion.fecha_inicio_ideal > this.data.fecha || 
      this.data.cumplimiento.cumplimientos_obligacion.fecha_maxima_fin < this.data.fecha) || 
      (this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento !== null && 
        this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento < this.data.fecha)) this.blanco = false

    if((this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento !== null && 
      this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento < this.data.fecha && 
      this.data.cumplimiento.cumplimientos_obligacion.completado !== 3) ||
      this.data.cumplimiento.cumplimientos_obligacion.fecha_maxima_fin < this.data.fecha) this.mensaje_blanco = "Cumplimieto aún no realizado"

    if( this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento !== null ){ //Si ya fue completado el cumplimiento
      if(this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento <= this.data.fecha && this.data.cumplimiento.cumplimientos_obligacion.completado === 1) {
        if(parseInt(this.data.fecha) >= parseInt(this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento) + 86400000 ) this.mensaje_blanco = "Cumplimiento pendiente de revisión retrasado 24 horas. Favor de contactar al supervisor"
        else this.mensaje_blanco = "Cumplimiento pendiente de revisión";
      }
    }

    console.log(this.data)

    const user = this.apiService.getWholeUser()
    let body = {}
    if(user.nombre_perfil === "Administrador" && (this.data.cumplimiento.cumplimientos_obligacion.completado === 1 || this.data.cumplimiento.cumplimientos_obligacion.completado === 2)) {
      this.disabled = true;
      this.texto = "Esperando confirmación del supervisor"
    } else if (user.nombre_perfil === "Supervisor" && this.data.cumplimiento.cumplimientos_obligacion.completado === 1){
      this.disabled = false;
      this.texto = "Comenzar a revisar como cumplido"
    } else if (user.nombre_perfil === "Supervisor" && this.data.cumplimiento.cumplimientos_obligacion.completado === 2){
      this.disabled = false;
      this.texto = "Terminar revisión"
    }

    if(this.data.cumplimiento.cumplimientos_obligacion.completado === true){
      this.disabled = true;
      this.texto = "Esperando confirmación del supervisor"
    }
    const today = Date.now()
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);
    fechaHoy.setTime(fechaHoy.getTime() - 1);
    

    if(this.data.cumplimiento.cumplimientos_obligacion.completado === 3 || this.data.fecha > today) this.showButton = false
    if(this.data.fecha < fechaHoy.getTime()) this.mostrarLeyenda = true
    
  }

  changeStatus(){
    const user = this.apiService.getWholeUser()
    let body
    if(user.nombre_perfil === "Administrador") {
      body = {
        obligation:{
          id: this.data.cumplimiento.cumplimientos_obligacion.id_obligacion,
          fecha_completado:parseInt(this.data.fecha),
          completado:1
        },
        cumplimientoMensual:null
      }
    } else if (user.nombre_perfil === "Supervisor"){
      if(this.data.cumplimiento.cumplimientos_obligacion.completado === 1) {
        body = {
          obligation:{
            id: this.data.cumplimiento.cumplimientos_obligacion.id_obligacion,
            fecha_completado:parseInt(this.data.fecha),
            completado:2
          },
          cumplimientoMensual:null
        }
      } else {
        body = {
          obligation:{
            id: this.data.cumplimiento.cumplimientos_obligacion.id_obligacion,
            fecha_completado:parseInt(this.data.fecha),
            completado:3
          },
          cumplimientoMensual:null
        }
      }
      
    }
    
    console.log(body)
    this.apiService.editDates(body).subscribe({
      next: res => {
        console.log(res)
        this.disabled = true;
        if(user.nombre_perfil === "Supervisor" && body.obligation.completado === 2){
          this.data.cumplimiento.cumplimientos_obligacion.completado = 2;
          //this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento = this.data.fecha
          this.texto = "Terminar revisión..."
          this.disabled = false;
          return
        } else if(user.nombre_perfil === "Supervisor" && body.obligation.completado === 3){
          this.data.cumplimiento.cumplimientos_obligacion.completado = 3;
          this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento = this.data.fecha
          this.showButton = false
        }
        this.texto = "Esperando confirmación del supervisor"
      },
      error: err => {
        console.log(err);
      }
    })
  }

  isFechaMaxima(element = this.data.cumplimiento, column = this.data.fecha): string {
    if (column === 0) {
      return 'transparent';
    }
    if(element.cumplimientos_obligacion.completado === 1 || element.cumplimientos_obligacion.completado === 2) return '#ffcc0c'
    else if(element.cumplimientos_obligacion.completado === 3) return 'green'
    else return 'transparent'
  }
}
