import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-festive-days',
  templateUrl: './festive-days.component.html',
  styleUrls: ['./festive-days.component.scss']
})
export class FestiveDaysComponent implements OnInit {

  dataSource = [{id:1, fecha:20, nombre:'navida', estatus:1}]

  day:Date
  name:String

  columnsToDisplay = ['dia','nombre', 'acciones'];

  columnNames = {
    nombre: 'Nombre',
    dia: 'Dia'
  };

  constructor( public apiService:ApiService, ) { }

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
      }
    })
  }

  getDays(){
    this.apiService.getDiasFestivos().subscribe({
      next:res => {
        console.log(res)
        //res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.dataSource = res.result
      }
    })
  }

  deleteDay(element){
    const body = {
      id: element.id
    }
    this.apiService.deleteDiaFestivo(body).subscribe({
      next:res => {
        console.log(res)
        //res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.getDays()
      }
    })
  }
}