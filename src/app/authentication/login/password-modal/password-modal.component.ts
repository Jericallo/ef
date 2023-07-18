import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-password-modal',
  templateUrl: './password-modal.component.html',
  styleUrls: ['./password-modal.component.scss']
})
export class PasswordModalComponent implements OnInit {

  message='';
  class_message='';

  constructor(private apiService: ApiService) { }

  loginForm: FormGroup;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  resetPass() {
    const email = this.loginForm.controls.email.value;
    this.apiService.postResetPass({ correo: email }).subscribe({
      next: (res) => {
        res = JSON.parse(this.apiService.decrypt(res.message, ''));
        console.log(res)
        this.message = res.message;
        this.class_message = "message_success"
      },
      error: (err) => {
        err = JSON.parse(this.apiService.decrypt(err.error.message,''));
        console.log(err);
        this.message = err.message;
        this.class_message = "message_error"
      }
    });
  }

}
