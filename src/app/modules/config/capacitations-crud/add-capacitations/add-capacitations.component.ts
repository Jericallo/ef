import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-capacitations',
  templateUrl: './add-capacitations.component.html',
  styleUrls: ['./add-capacitations.component.scss']
})
export class AddCapacitationsComponent implements OnInit {
  
  titulo:string
  descripcion:string
  tiempo_limite:string
  pertenece_a:string
  file:any
  image:any
  novo = '0'
  text = 'Guardar'
  duration = 'min1'
  filteredCapacitaciones = []

  constructor(dialogRef:MatDialogRef<AddCapacitationsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) { }

  ngOnInit(): void {
    this.data.capacitations.forEach(element => {
      if(element.nivel_1 !== undefined && element.nivel_1.toString() > this.novo) this.novo = element.nivel_1.toString()
    });
    this.novo = (parseInt(this.novo) + 1).toString()

    this.filteredCapacitaciones = this.data.capacitations.filter(element => element.nivel_3 === null || element.nivel_3 === 0)

    console.log(this.filteredCapacitaciones)
  }

  createCapacitation(){
    this.text = 'Guardando...'

    const formData = new FormData();
    formData.append('nombre', this.titulo.toString())
    formData.append('length', this.duration)
    formData.append('category', 'news')
    formData.append('video', this.file)
    formData.append('image', this.image)
    console.log(formData)
    this.apiService.postVideos(formData).subscribe({
      next:res => {
        console.log(res)

        let nivel_1 = 0
        let nivel_2 = 0
        let nivel_3 = 0

        if(this.pertenece_a.includes('/')){
          const separadas = this.pertenece_a.split('/')
          console.log(separadas)
          if(parseInt(separadas[0]) > 0){
            nivel_1 = parseInt(separadas[0]);
            const filtrados = this.data.capacitations.filter(objeto => objeto.nivel_1 == nivel_1);
            filtrados.sort((a, b) => a.nivel_2 - b.nivel_2);
            
            console.log(filtrados[filtrados.length - 1])
            if(filtrados[filtrados.length - 1].nivel_2 === null){
              nivel_2 = 1
            } else {
              nivel_2 = parseInt(filtrados[filtrados.length - 1].nivel_2) + 1
            }
          } else {
            const filtrados = this.data.sort((a, b) => a.nivel_1 - b.nivel_1)
            nivel_1 = filtrados[filtrados.length - 1].nivel_1 + 1
          }
          if(parseInt(separadas[1]) > 0){
            nivel_2 = parseInt(separadas[1])
            const filtrados = this.data.capacitations.filter(objeto => objeto.nivel_2 == nivel_2 && objeto.nivel_1 == nivel_1);
            filtrados.sort((a, b) => a.nivel_3 - b.nivel_3);

            if(filtrados[filtrados.length - 1].nivel_3 === null) {
              nivel_3 = 1
            } else {
              nivel_3 = parseInt(filtrados[filtrados.length - 1].nivel_3) + 1
            }
          }
        } else {
          nivel_1 = parseInt(this.pertenece_a)
        }

        const body = {
          titulo: this.titulo,
          descripcion: this.descripcion,
          transcripcion: this.descripcion,
          tiempo_limite: parseInt(this.tiempo_limite),
          cantidad_preguntas: 1,
          nivel_1:nivel_1,
          nivel_2:nivel_2,
          nivel_3:nivel_3,
          id_video:res.result.id
        }
        console.log(body)
        this.apiService.postCapacitations(body).subscribe({
          next:(res) => {
            console.log(res)
            Swal.fire('Guardado exitosamente')
            this.text = 'Guardar'
          }, error:(error) => {
            this.text = 'Guardar'
            console.log(error)
          }
        })

      }, error: (error) => {
        console.log(error)
        Swal.fire('Ocurrió un error, intente de nuevo más tarde')
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

  validateNumberInput(event: any): void {
    const input = event.target;
    const filteredValue = input.value.replace(/[^0-9]/g, '');
    input.value = filteredValue;
    this.tiempo_limite = filteredValue;
}

}