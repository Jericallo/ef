import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MyserviceService } from '../../myservice.service';
import { MatDialog } from '@angular/material/dialog';
import { PasswordModalComponent } from './password-modal/password-modal.component';
import { ApiService } from '../../shared/services/api.service';
import {FormGroup,Validators,FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MyserviceService, ApiService]
})
export class LoginComponent implements OnInit {
  msg = '';
  constructor(private service: MyserviceService,private apiService: ApiService,  private routes: Router, private dialogRef: MatDialog) { }

  openDialog(){
    this.dialogRef.open(PasswordModalComponent);
  }

  login() {
    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;

    this.apiService.login({ correo: username, contra: password }).subscribe({
      next: (res) => {
        console.log(res)
        localStorage.setItem(this.apiService.TOKEN, JSON.stringify(res.user));
      },
      error: (err) => {
        console.log('ERROR');
        this.msg = 'Correo o contraseña incorrectos en v2';
        localStorage.setItem(this.apiService.TOKEN, '{"id":2,"id_perfil":1,"correo":"gabo@alphadev.io","telefono":"3343543345","nombre":"Gabriel Contrera","contra":"789789","fecha_creacion":"2022-11-09T00:00:00.000Z","fecha_modificacion":null,"estatus":1,"llave":"fJAQuxCohTng0+k0qlcNS28YJf41Wtdb","perfil":{"id":1,"nombre":"Administrador de Global Business","id_modulo":1,"estatus":true,"fecha_creacion":"2023-07-25T14:35:50.000Z","fecha_modificacion":null,"perfiles_modulos":[{"id":1,"id_perfil":1,"id_modulo":1,"permisos":"R-W-E","fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1,"modulos":{"id":1,"nombre":"Inicio","orden":1,"modulo_padre":null,"fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1}},{"id":2,"id_perfil":1,"id_modulo":2,"permisos":"-----","fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1,"modulos":{"id":2,"nombre":"Cumplimiento","orden":2,"modulo_padre":null,"fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1}},{"id":86,"id_perfil":1,"id_modulo":11,"permisos":"R-W-E","fecha_modificacion":null,"fecha_creacion":"2024-04-25T23:27:16.000Z","estatus":1,"modulos":{"id":11,"nombre":"Leyes","orden":3,"modulo_padre":1,"fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1}},{"id":88,"id_perfil":1,"id_modulo":13,"permisos":"R-W-E","fecha_modificacion":null,"fecha_creacion":"2024-04-25T23:43:04.000Z","estatus":1,"modulos":{"id":13,"nombre":"Busqueda","orden":5,"modulo_padre":1,"fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1}},{"id":90,"id_perfil":1,"id_modulo":12,"permisos":"R-W-E","fecha_modificacion":null,"fecha_creacion":"2024-04-25T23:43:31.000Z","estatus":1,"modulos":{"id":12,"nombre":"Temario","orden":4,"modulo_padre":1,"fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1}},{"id":94,"id_perfil":1,"id_modulo":10,"permisos":"R-W-E","fecha_modificacion":null,"fecha_creacion":"2024-04-26T04:08:32.000Z","estatus":1,"modulos":{"id":10,"nombre":"Noticias","orden":2,"modulo_padre":1,"fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1}},{"id":103,"id_perfil":1,"id_modulo":14,"permisos":"R-W-E","fecha_modificacion":null,"fecha_creacion":"2024-04-27T00:33:59.000Z","estatus":1,"modulos":{"id":14,"nombre":"Incentivos","orden":6,"modulo_padre":1,"fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1}},{"id":104,"id_perfil":1,"id_modulo":9,"permisos":"R-W-E","fecha_modificacion":null,"fecha_creacion":"2024-04-27T03:03:34.000Z","estatus":1,"modulos":{"id":9,"nombre":"Intro","orden":1,"modulo_padre":1,"fecha_modificacion":null,"fecha_creacion":"2023-07-25T14:35:50.000Z","estatus":1}}]},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoyLCJpYXQiOjE3Mjc0NjcxNTF9.VSUv8_9GSobCyQrzpt56_BIDWswXel3yFBuOC9F4A14"}')
      }
    });

    this.apiService.loginv3({ email: username, password: password }).subscribe({
      next: (res) => {
        console.log('CORRECT LOGIN',res)
        localStorage.setItem(this.apiService.TOKEN_V3, JSON.stringify(res));
        this.routes.navigate(['/main']);
      },
      error: (err) => {
        console.log(err);
        this.msg = 'Correo o contraseña incorrectos';
      }
    });
  }

  check(uname: string, p: string) {
    const output = this.service.checkusernameandpassword(uname, p);
    if (output == true) {
      this.routes.navigate(['/main']);
    } else {  
      this.msg = 'Correo o contraseña incorrectos';
    }
  }

  //REMEMBER ME
  rememberMe(checked: boolean){
    if (checked) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }  
  }

  //PASSWORD VISIBILITY
  public showPassword: boolean = false;
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    if (this.icon === 'visibility') {
      this.icon = 'visibility_off';
    } else {
      this.icon = this.originalIcon;
    }
  }

  public originalIcon = 'visibility'; 
  public icon = this.originalIcon;

  changeIcon(newIcon: string) {
    if (this.icon === newIcon) {
      this.icon = this.originalIcon;
    } else {
      this.icon = newIcon;
    }
  }

  loginForm: FormGroup

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });  
    const rememberMe = localStorage.getItem('rememberMe');
    const token_user = localStorage.getItem(this.apiService.TOKEN)
    if (rememberMe === 'true' && token_user) {
      this.routes.navigate(['/main']);
    } else {
      localStorage.removeItem(this.apiService.TOKEN)
    }
  }
}