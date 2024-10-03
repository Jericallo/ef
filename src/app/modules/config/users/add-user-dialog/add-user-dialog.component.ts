import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

interface Usuario {
  id: string;
  email: string;
  password: string;
  name: string; 
  phoneNumber: string;
  role: string; 
}


@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  editedUser: Usuario = {
    id: '',
    email: '',
    password:'', 
    name: '',
    phoneNumber: '',
    role:''
  };

  perfiles = []

  camposInvalidos: boolean = false;
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phonePattern: RegExp = /^\d{8}$|^\d{10}$/;


  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getProfiles()
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getProfiles(){
    this.apiService.getProfiles().subscribe(
      (response) => {
        console.log('Perfiles', response);
        this.perfiles = response
      },
      (error) => {
        console.error('Error al agregar el usuario', error);
      }
    );
  }

  saveUser() {
    if (this.camposSonValidos()) {
      const body = this.editedUser
      body.phoneNumber = body.phoneNumber.toString()
      this.apiService.postUser(body).subscribe(
        (response) => {
          Swal.fire({
            title: 'Usuario agregado exitosamente!',
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
      this.emailPattern.test(this.editedUser.email.trim()) &&
      this.editedUser.name.trim() !== '' &&
      this.phonePattern.test(this.editedUser.phoneNumber.toString()));
  }

  onPerfilChange(event) {
    this.editedUser.role = event.value
  }
}
