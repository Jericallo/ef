import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { AddProfileDialogComponent } from '../../profiles/add-profile-dialog/add-profile-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-intros',
  templateUrl: './edit-intros.component.html',
  styleUrls: ['./edit-intros.component.scss']
})
export class EditIntrosComponent implements OnInit {

  file:any
  title:string
  image:any

  textButton = 'Editar'

  constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddProfileDialogComponent>) { }

  ngOnInit(): void {
    this.title = this.data.video.nombre    
  }

  addVideo(){
    this.textButton = 'Editando...'
    const formData = new FormData();
    formData.append('id',this.data.video.id)

    if(this.file !== undefined && this.file !== null) formData.append('video', this.file)
    if(this.title !== undefined && this.title !== null) formData.append('nombre', this.title)
    if(this.image !== undefined && this.image !== null) formData.append('image', this.image)

    console.log(formData)
    this.apiService.putVideos(formData).subscribe({
      next:res => {
        console.log(res)
        Swal.fire('Editado exitosamente')
        this.dialogRef.close()
      }, error: (error) => {
        Swal.fire('Ocurrió un error, intente de nuevo más tarde'),
        this.textButton = 'Editar'
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
