import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

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

  constructor(dialogRef:MatDialogRef<AddCapacitationsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) { }

  ngOnInit(): void {
  }

  createCapacitation(){
    const separadas = this.pertenece_a.split('/')
    let nivel_1 = 0
    let nivel_2 = 0
    let nivel_3 = 0

    if(parseInt(separadas[0]) > 0){
      nivel_1 = parseInt(separadas[0]);
      const filtrados = this.data.capacitations.filter(objeto => objeto.nivel_1 == nivel_1);
      filtrados.sort((a, b) => a.nivel_2 - b.nivel_2);
      
      nivel_2 = parseInt(filtrados[filtrados.length - 1].nivel_2) + 1
    } else {
      const filtrados = this.data.sort((a, b) => a.nivel_1 - b.nivel_1)
      nivel_1 = filtrados[filtrados.length - 1].nivel_1 + 1
    }
    if(parseInt(separadas[1]) > 0){
      nivel_2 = parseInt(separadas[1])
      const filtrados = this.data.capacitations.filter(objeto => objeto.nivel_2 == nivel_2);
      filtrados.sort((a, b) => a.nivel_3 - b.nivel_3);

      nivel_3 = parseInt(filtrados[filtrados.length - 1].nivel_3) + 1

    }

    const body = {
      titulo: this.titulo,
      descripcion: this.descripcion,
      transcripcion: this.descripcion,
      tiempo_limite: parseInt(this.tiempo_limite),
      cantidad_preguntas: 1,
      nivel_1:nivel_1,
      nivel_2:nivel_2,
      nivel_3:nivel_3
    }
    console.log(body)
    this.apiService.postCapacitations(body).subscribe({
      next:(res) => {
        console.log(res)
      }, error:(error) => {
        console.log(error)
      }
    })
  }
}