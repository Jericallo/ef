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
  
  name:string
  description:string
  length:string
  type:string
  obligationId:string
  
  text = 'Guardar'
  filteredCapacitaciones = []

  types = [
    {value:'oneMin', label: '1 Minuto'},
    {value:'threeMin', label: '3 Minutos'},
    {value:'fiveMin', label: '5 Minutos'},
  ]
  allObligations = []

  constructor(public dialogRef:MatDialogRef<AddCapacitationsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) { }

  ngOnInit(): void {
    this.fetchObligations()
  }

  fetchObligations() {
    this.apiService.getAllObligations().subscribe({
      next: res => {
        this.allObligations = res
      }, error: err => {
        console.error(err)
      }
    })
  }

  createCapacitation(){
    this.text = 'Guardando...'

    const body= {
      name: this.name,
      description: this.description,
      length: this.length,
      type:this.type,
      obligationId: this.obligationId
    }

    this.apiService.createCapacitations(body).subscribe({
      next:res => {
        Swal.fire('Capacitación agregada', 'La capacitación ha sido agregada exitosamente.')
        this.dialogRef.close()
      }, error: (error) => {
        console.log(error)
        this.text = 'Guardar'
        Swal.fire('Ocurrió un error, intente de nuevo más tarde')
      }
    })
  }

  validateNumberInput(event: any): void {
    const input = event.target;
    const filteredValue = input.value.replace(/[^0-9]/g, '');
    input.value = filteredValue;
    this.length = filteredValue;
}

}