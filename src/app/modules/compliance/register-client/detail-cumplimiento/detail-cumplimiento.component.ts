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
    console.log(this.data.cumplimiento)
    if((this.data.cumplimiento.ideal_date_start > this.data.fecha ) || 
      (this.data.cumplimiento.fecha_completado !== null && this.data.cumplimiento.fecha_completado !== '0' &&
        this.data.cumplimiento.fecha_completado < this.data.fecha)) this.blanco = false

    if((this.data.cumplimiento.fecha_completado !== null && 
      this.data.cumplimiento.fecha_completado < this.data.fecha && 
      this.data.cumplimiento.completado !== 3) ||
      this.data.cumplimiento.urgent_date_end < this.data.fecha) this.mensaje_blanco = "Cumplimieto aún no realizado"

    if( this.data.cumplimiento.fecha_completado !== null ){ //Si ya fue completado el cumplimiento
      if(this.data.cumplimiento.fecha_completado <= this.data.fecha && this.data.cumplimiento.completado === 1) {
        if(parseInt(this.data.fecha) >= parseInt(this.data.cumplimiento.fecha_completado) + 86400000 ) this.mensaje_blanco = "Cumplimiento pendiente de revisión retrasado 24 horas. Favor de contactar al supervisor"
        else this.mensaje_blanco = "Cumplimiento pendiente de revisión";
      }
    }


    const user = this.apiService.getWholeUser()
    let body = {}
    if((user.id_perfil === 1 || user.id_perfil === 64 || user.id_perfil === 65) && (this.data.cumplimiento.completado === 1 || this.data.cumplimiento.completado === 2)) {
      this.disabled = true;
      this.texto = "Esperando confirmación del supervisor"
    } else if ((user.id_perfil === 66 || user.id_perfil === 67) && this.data.cumplimiento.completado === 1){
      this.disabled = false;
      this.texto = "Comenzar a revisar como cumplido"
    } else if ((user.id_perfil === 66 || user.id_perfil === 67) && this.data.cumplimiento.completado === 2){
      this.disabled = false;
      this.texto = "Terminar revisión"
    }

    if(this.data.cumplimiento.completado === true){
      this.disabled = true;
      this.texto = "Esperando confirmación del supervisor"
    }
    const today = Date.now()
    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);
    fechaHoy.setTime(fechaHoy.getTime() - 1);
    
    if(this.data.cumplimiento.completado === 3 || parseInt(this.data.fecha) > today + 86400000) this.showButton = false
    if(this.data.fecha < fechaHoy.getTime()) this.mostrarLeyenda = true
    
  }

  changeStatus(){
    const user = this.apiService.getWholeUser()
    console.log(user)
    let body
    if(user.id_perfil === 1 || user.id_perfil === 64 || user.id_perfil === 65) {
      body = {
        id: this.data.cumplimiento.id,
        fecha_completado:parseInt(this.data.fecha),
        completado:1
      }
    } else if (user.id_perfil === 67 || user.id_perfil === 66){
      if(this.data.cumplimiento.completado === 1) {
        body = {
          id: this.data.cumplimiento.id,
          fecha_completado:parseInt(this.data.fecha),
          completado:2
        }
      } else {
        body = {
          id: this.data.cumplimiento.id,
          fecha_completado:parseInt(this.data.fecha),
          completado:3
        }
      }
      
    }
    
    this.apiService.editDates(body).subscribe({
      next: res => {
        console.log('ENTRA',res)
        this.disabled = true;
        if(user.id_perfil === 67 || user.id_perfil === 66 && body.completado === 2){
          this.data.cumplimiento.completado = 2;
          this.texto = "Terminar revisión..."
          this.disabled = false;
          return
        } else if(user.id_perfil === 67 || user.id_perfil === 66 && body.completado === 3){
          this.data.cumplimiento.completado = 3;
          this.data.cumplimiento.fecha_completado = this.data.fecha
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
    if(element.completado === 1 || element.completado === 2) return '#ffcc0c'
    else if(element.completado === 3) return 'green'
    else return 'transparent'
  }
}
