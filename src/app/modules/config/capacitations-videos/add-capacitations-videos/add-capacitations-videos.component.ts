import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-capacitations-videos',
  templateUrl: './add-capacitations-videos.component.html',
  styleUrls: ['./add-capacitations-videos.component.scss']
})
export class AddCapacitationsVideosComponent implements OnInit {

  name:String
  length:String
  file:any
  image:any

  date:String;
  dateDate:Date

  textButton = 'Guardar'

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddCapacitationsVideosComponent>) { }

  ngOnInit(): void {
  }
  
  addVideo(){
    this.textButton = 'Guardando...'
    const formData = new FormData();
    formData.append('nombre', this.name.toString())
    formData.append('length', this.length.toString())
    formData.append('category', 'trainning')
    formData.append('video', this.file)
    formData.append('image', this.image)
    console.log(formData)
    this.apiService.postVideos(formData).subscribe({
      next:res => {
        console.log(res)
        Swal.fire('Guardado exitosamente')
        this.dialogRef.close()
      }, error: (error) => {
        Swal.fire('Ocurrió un error, intente de nuevo más tarde')
        this.textButton = 'Guardar'
      }
    })
    
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

  seleccionarImagen(event: any) {
    const archivoSeleccionado = event.target.files[0];
    if (archivoSeleccionado) {
      const nombreArchivo = archivoSeleccionado.name;
      if (nombreArchivo.endsWith('.png') || nombreArchivo.endsWith('.jpg') || nombreArchivo.endsWith('.jpeg')) {
        this.image = event.target.files[0]
      } else {
        alert('Por favor seleccione un archivo .mp4');
      }
    }
  }
}
