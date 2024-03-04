import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

interface Usuario {
  correo: string;
  nombre: string;
  telefono: number; 
  contra: string;
  estatus: number; 
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  editedUser: Usuario = {
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

  constructor( private apiService: ApiService ) { }

  ngOnInit(): void {
    //let id = this.apiService.getWholeUser()
    this.getUserById()
  }

  saveUser() {
    if (this.camposSonValidos()) {
      const body = { model: "usuarios", data: this.editedUser }
      console.log(body)
      this.apiService.putUser(body).subscribe(
        (response) => {
          console.log('Usuario editado exitosamente', response);
          Swal.fire({
            title: 'Perfil editado exitosamente!',
            icon: 'success',
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton:true,
            confirmButtonText:"Aceptar",
            confirmButtonColor: "#109ff5"
          })
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
      this.emailPattern.test(this.editedUser.correo.trim()) &&
      this.editedUser.nombre.trim() !== '' &&
      this.phonePattern.test(this.editedUser.telefono.toString()));
  }

  getUserById(){
    let id = this.apiService.getWholeUser()
    this.apiService.getUserById(id.id).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'))
        console.log(res)
        this.editedUser = res.result[0]
      }
    })
  }
}
