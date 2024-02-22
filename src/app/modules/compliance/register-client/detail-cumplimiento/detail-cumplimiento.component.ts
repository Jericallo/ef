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

  constructor(public apiService: ApiService, public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any ) { }

  ngOnInit(): void {
    console.log(this.data)

    const user = this.apiService.getWholeUser()
    let body = {}
    if(user.nombre_perfil === "Administrador" && this.data.cumplimiento.cumplimientos_obligacion.completado === 1) {
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
        if(user.nombre_perfil === "Supervisor" || body.obligation.completado === 2){
          this.data.cumplimiento.cumplimientos_obligacion.completado = 2;
          //this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento = this.data.fecha
          this.texto = "Terminar revisión..."
          this.disabled = false;
          return
        } else if(user.nombre_perfil === "Supervisor" || body.obligation.completado === 3){
          this.data.cumplimiento.cumplimientos_obligacion.completado = 3;
          this.data.cumplimiento.cumplimientos_obligacion.fecha_cumplimiento = this.data.fecha
        }
        this.texto = "Esperando confirmación del supervisor"
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
