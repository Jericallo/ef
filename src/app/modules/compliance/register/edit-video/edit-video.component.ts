import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.scss']
})
export class EditVideoComponent implements OnInit {

  file:any

  textButton = 'Editar'

  constructor(private apiService: ApiService, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EditVideoComponent>) { }

  ngOnInit(): void {
  }

  addVideo(){
    this.textButton = 'Editando...'
    const formData = new FormData();
    formData.append('id',this.data.id)

    if(this.file !== undefined && this.file !== null) formData.append('video', this.file)

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

}
