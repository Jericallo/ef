import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import { AddProfileDialogComponent } from '../../profiles/add-profile-dialog/add-profile-dialog.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-promotional',
  templateUrl: './add-promotional.component.html',
  styleUrls: ['./add-promotional.component.scss']
})
export class AddPromotionalComponent implements OnInit {

  name:String
  length:String
  file:any
  image:any

  textButton = 'Guardar'

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddProfileDialogComponent>) { }

  ngOnInit(): void {
  }
  
  addVideo(){
    this.textButton = 'Guardando...'
    const formData = new FormData();
    formData.append('nombre', this.name.toString())
    formData.append('length', 'min5')
    formData.append('category', 'promotional')
    formData.append('video', this.file)
    formData.append('image', this.image)
    console.log(formData)
    this.apiService.postVideos(formData).subscribe({
      next:res => {
        Swal.fire('Guardado exitosamente')
        this.dialogRef.close()
      }, error: (error) => {
        Swal.fire('Ocurrió un error, intente de nuevo más tarde'),
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
