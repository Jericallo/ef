
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

interface Usuario {
  id_perfil: number;
  correo: string;
  nombre: string;
  telefono: number; 
  contra: string;
  estatus: number; 
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {


  editedUser: Usuario = {
    id_perfil: 1, 
    correo: '',
    nombre: '',
    telefono:null, 
    contra: '',
    estatus: 1 
  };

  camposInvalidos: boolean = false;
  passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phonePattern: RegExp = /^\d{8}$|^\d{10}$/;


  constructor(public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {user: any}, private apiService: ApiService) {
      this.editedUser = { ...data.user };
     }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveUser() {
    if (this.camposSonValidos()) {
      const body = { model: "usuarios", data: this.editedUser }
      console.log(body)
      this.apiService.putUser(body).subscribe(
        (response) => {
          console.log('Usuario editado exitosamente', response);
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
  

  onPerfilChange(event: any) {
    const selectedValue = +event.value;
    this.editedUser.id_perfil = selectedValue;
  }

  camposSonValidos(): boolean {
    return (
      this.editedUser.id_perfil &&
      this.emailPattern.test(this.editedUser.correo.trim()) &&
      this.editedUser.nombre.trim() !== '' &&
      this.phonePattern.test(this.editedUser.telefono.toString()));
  }
}

