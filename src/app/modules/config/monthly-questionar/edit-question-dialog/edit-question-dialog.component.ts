import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

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
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveUser() {
    if (this.camposSonValidos()) {
      // const body = this.editedUser
      // body.phoneNumber = body.phoneNumber.toString()
      // this.apiService.postUser(body).subscribe(
      //   (response) => {
      //     Swal.fire({
      //       title: 'Usuario agregado exitosamente!',
      //       icon: 'success',
      //       showDenyButton: false,
      //       showCancelButton: false,
      //       showConfirmButton:true,
      //       confirmButtonText:"Aceptar",
      //       confirmButtonColor: "#109ff5"
      //     })
          this.dialogRef.close()
      //   },
      //   (error) => {
      //     console.error('Error al agregar el usuario', error);
      //   }
      // );
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
