import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeComponent implements OnInit {

  oldPassword = ''
  newPassword = ''
  check = false
  faltanCampos = false
  oldPasswordFieldType: string = 'password';
  newPasswordFieldType: string = 'password';

  constructor( public dialogRef: MatDialogRef<PasswordChangeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService ) { }

  ngOnInit(): void {
    console.log(this.data)
  }

  changePassword() {
    this.check = true;
    console.log(this.oldPassword, this.newPassword, this.data.user.contra)
    if(this.newPassword === '' || this.oldPassword === ''){
      this.faltanCampos = true;
      return
    } else this.faltanCampos = false;

    if(this.oldPassword !== this.data.user.contra) return

    const body = { model: "usuarios", data: { contra: this.newPassword, id:this.data.user.id } }
      console.log(body)
      this.apiService.putUser(body, this.data.user.id).subscribe(
        (response) => {
          Swal.fire({
            title: 'Contraseña cambiada exitosamente!',
            icon: 'success',
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton:true,
            confirmButtonText:"Aceptar",
            confirmButtonColor: "#109ff5"
          })
        },
        (error) => {
          console.error('Error al editar el usuario', JSON.parse(this.apiService.decrypt(error.error.message, 'private')));
          Swal.fire({
            title: 'Ocurrió un error al cambiar la contraseña',
            icon: 'error',
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton:true,
            confirmButtonText:"Aceptar",
            confirmButtonColor: "#109ff5"
          })
        }
      );
  }

  toggleOldPasswordVisibility() {
    this.oldPasswordFieldType = this.oldPasswordFieldType === 'password' ? 'text' : 'password';
}

  toggleNewPasswordVisibility() {
      this.newPasswordFieldType = this.newPasswordFieldType === 'password' ? 'text' : 'password';
  }
}
