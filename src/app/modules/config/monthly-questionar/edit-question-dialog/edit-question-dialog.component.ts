import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-question-dialog',
  templateUrl: './edit-question-dialog.component.html',
  styleUrls: ['./edit-question-dialog.component.scss']
})
export class EditQuestionDialogComponent implements OnInit {

  camposInvalidos: boolean = false;
  question:string

  constructor(public dialogRef: MatDialogRef<EditQuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) { }

  ngOnInit(): void {
    this.question = this.data.user.question
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveUser() {
    if (this.camposSonValidos()) {
      const body = {content:this.question}
      this.apiService.putMonthlyQuestions(body, this.data.user.id).subscribe(
        (response) => {
          Swal.fire({
            title: 'Pregunta editada exitosamente!',
            icon: 'success',
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton:true,
            confirmButtonText:"Aceptar",
            confirmButtonColor: "#109ff5"
          })
          this.dialogRef.close()
        },
        (error) => {
          console.error('Error al agregar el usuario', error);
        }
      );
    } else {
      this.camposInvalidos = true;
    }
  }
  
  camposSonValidos(): boolean {
    return (
      this.question.trim() !== ''
    )
  }

}
