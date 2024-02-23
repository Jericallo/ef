import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-festive-days',
  templateUrl: './festive-days.component.html',
  styleUrls: ['./festive-days.component.scss']
})
export class FestiveDaysComponent implements OnInit {

  dataSource = [{id:1, fecha:20, nombre:'navida', estatus:1}]
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}
  day:Date
  name:String

  columnsToDisplay = ['dia','nombre', 'acciones'];

  columnNames = {
    nombre: 'Nombre',
    dia: 'Dia'
  };

  constructor( public apiService:ApiService, public snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.getDays()
  }

  submitDay(){
    const body = {
      fecha:this.day.getTime(),
      nombre:this.name
    }
    console.log(body)

    this.apiService.postDiasFestivos(body).subscribe({
      next:res => {
        console.log(res)
        //res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.getDays()
        this.snackBar.open('Día festivo agregado exitosamente', '', this.config_snack);
      },
      error: err => {
        this.snackBar.open('Ocurrió un error al agregar el día festivo', '', this.config_snack);
      }
    })
  }

  getDays(){
    this.apiService.getDiasFestivos().subscribe({
      next:res => {
        console.log(res)
        //res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.dataSource = res.result
      },
      error: err => {
        this.snackBar.open('Ocurrió un error al obtener los días festivos', '', this.config_snack);
      }
    })
  }

  deleteDay(element){
    const body = {
      id: element.id
    }

    Swal.fire({
      title: "¿Seguro que desea borrar el día festivo?",
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton:false,
      denyButtonText: `Borrar`,
      cancelButtonText:'Cancelar'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        this.apiService.deleteDiaFestivo(body).subscribe({
          next:res => {
            console.log(res)
            //res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
            this.getDays()
            this.snackBar.open('Día festivo borrado exitosamente', '', this.config_snack);
          }
        })
      } 
    });
    
  }
}