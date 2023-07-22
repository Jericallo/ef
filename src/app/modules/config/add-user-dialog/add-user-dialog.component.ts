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
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent implements OnInit {

  nuevoUsuario: Usuario = {
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


  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveUser() {
    if (this.camposSonValidos()) {
      const body = { model: "usuarios", data: this.nuevoUsuario }
      this.apiService.postUser(body).subscribe(
        (response) => {
          console.log('Usuario agregado exitosamente', response);
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
    this.nuevoUsuario.id_perfil = selectedValue;
  }

  camposSonValidos(): boolean {
    return (
      this.nuevoUsuario.id_perfil &&
      this.emailPattern.test(this.nuevoUsuario.correo.trim()) &&
      this.nuevoUsuario.nombre.trim() !== '' &&
      this.phonePattern.test(this.nuevoUsuario.telefono.toString()) &&
      this.passwordPattern.test(this.nuevoUsuario.contra.trim())
    );
  }
}
