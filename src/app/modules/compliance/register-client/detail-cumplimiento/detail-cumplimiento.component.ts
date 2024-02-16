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
      this.texto = "Confirmar como cumplido"
    }

    if(this.data.cumplimiento.cumplimientos_obligacion.completado === true){
      this.disabled = true;
      this.texto = "Esperando confirmación del supervisor"
    }
  }

  changeStatus(){
    const user = this.apiService.getWholeUser()
    let body = {}
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
      body = {
        obligation:{
          id: this.data.cumplimiento.cumplimientos_obligacion.id_obligacion,
          fecha_completado:parseInt(this.data.fecha),
          completado:2
        },
        cumplimientoMensual:null
      }
    }
    


    console.log(body)
    this.apiService.editDates(body).subscribe({
      next: res => {
        console.log(res)
        this.disabled = true;
      this.texto = "Esperando confirmación del supervisor"
      },
      error: err => {
        console.log(err);
      }
    })
  }
}
