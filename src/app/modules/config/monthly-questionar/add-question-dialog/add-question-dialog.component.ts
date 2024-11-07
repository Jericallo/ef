import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddUserDialogComponent } from '../../users/add-user-dialog/add-user-dialog.component';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-question-dialog',
  templateUrl: './add-question-dialog.component.html',
  styleUrls: ['./add-question-dialog.component.scss']
})

export class AddQuestionDialogComponent implements OnInit {
  camposInvalidos: boolean = false;
  question:string

  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>,
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
