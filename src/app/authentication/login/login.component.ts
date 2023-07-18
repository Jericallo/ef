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

    this.apiService.login({ correo: username, contraseña: password }).subscribe({
      next: (res) => {
        res = JSON.parse(this.apiService.decrypt(res.message, ''));
        localStorage.setItem(this.apiService.TOKEN, JSON.stringify(res.data));
        this.routes.navigate(['/main']);
      },
      error: (err) => {
        err = JSON.parse(this.apiService.decrypt(err.error.message,''));
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
    if (rememberMe === 'true') {
      this.routes.navigate(['/main']);
    }
  }
}