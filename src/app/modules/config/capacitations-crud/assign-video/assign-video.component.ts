import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddCapacitationsComponent } from '../add-capacitations/add-capacitations.component';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-video',
  templateUrl: './assign-video.component.html',
  styleUrls: ['./assign-video.component.scss']
})
export class AssignVideoComponent implements OnInit {

  capacitaciones = null
  id_cap:number
  textButton = 'Guardar'

  constructor(public dialogRef:MatDialogRef<AssignVideoComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getVideos()
  }

  getVideos(){
    this.apiService.getVideos('trainning').subscribe({
      next:res => {
        console.log(res)
        this.capacitaciones = res.result
      }
    })
  }

  assignVideo(){
    this.textButton = 'Guardando...'
    const body ={
      id: this.data.capacitation.id,
      id_video: this.id_cap
    }
    this.apiService.putCapacitations(body).subscribe({
      next:res => {
        console.log(res)
        Swal.fire('Asignado exitosamente')
        this.dialogRef.close()
      }, error: (error) => {
        Swal.fire('Ocurrió un error, intente de nuevo más tarde')
        this.textButton = 'Guardar'
      }
    })
    this.textButton = 'Guardar'
  }

  close(){
    this.dialogRef.close()
  }

}
