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
  file:any
  photo:any

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
    if(!this.photo || !this.file){
      alert('Por favor seleccione la media que desea subir');
      return
    }

    this.textButton = 'Guardando...'
    const formData = new FormData();
    formData.append('trainingId', this.data.capacitation.id.toString())
    formData.append('trainingVideo', this.file)
    formData.append('trainingImage', this.photo)

    console.log(formData)

    this.apiService.uploadCapacitationVideo(formData).subscribe({
      next:res => {
        Swal.fire('Asignado exitosamente')
        this.dialogRef.close()
      }, error: (error) => {
        Swal.fire('Ocurrió un error, intente de nuevo más tarde')
        this.textButton = 'Guardar'
      }
    })
    this.textButton = 'Guardar'
  }

  seleccionarArchivo(event: any) {
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      const nombreArchivo = archivoSeleccionado.name;
      if (nombreArchivo.endsWith('.mp4')) {
        this.file = event.target.files[0]
      } else {
        alert('Por favor seleccione un archivo .mp4');
      }
    }
  }

  seleccionarArchivoFoto(event: any) {
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      const nombreArchivo = archivoSeleccionado.name;
      console.log(nombreArchivo);
      if (nombreArchivo.endsWith('.png') || nombreArchivo.endsWith('.jpg') || nombreArchivo.endsWith('.jpeg')) {
        this.photo = archivoSeleccionado;
      } else {
        alert('Por favor seleccione un archivo de fotografía válido');
      }
    }
  }  

  close(){
    this.dialogRef.close()
  }

}
