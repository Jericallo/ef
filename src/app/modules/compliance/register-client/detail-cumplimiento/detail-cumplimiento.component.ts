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

    if(this.data.cumplimiento.cumplimientos_obligacion.completado === true){
      this.disabled = true;
      this.texto = "Esperando confirmación del supervisor"
    }
  }

  changeStatus(){
    const body = {
      data: {
        id: this.data.cumplimiento.id_cumplimiento_mensual,
        special: "true",
        completado:true,
        fecha_cumplimiento:this.data.fecha.toString(),
        obligacion:{}
      }
    }
    console.log(body)
    this.apiService.editCumplimiento(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
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
