import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/shared/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  hash: string
  passwordsMatch: boolean = true;
  password: ''
  confirmPassword: ''
  passForm: FormGroup

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private routes: Router) {
    this.passForm = this.formBuilder.group({
      password: ['', Validators.required],
      passwordCheck: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        console.log(params)
        this.hash = params.hash
        if(this.hash === undefined ){
          this.routes.navigate(['/login']);
        }
        console.log(this.hash)
      })
  }

  setPassword() {
    const password = this.passForm.controls.password.value;
    const hash = this.hash;
    console.log(password);
    const data = {
      contra: password,
      hash: hash
    };
    this.apiService.setNewPassword(data).subscribe({
      next: (res) => {
        res = JSON.parse(this.apiService.decrypt(res.message, ''));
        console.log(res);
      },
      error:(err) =>{
        err = JSON.parse(this.apiService.decrypt(err.error.message,''));
        console.log(err)
      }
    });
  }

  checkPasswordsMatch() {
    this.passwordsMatch = this.passForm.controls.password.value === this.passForm.controls.passwordCheck.value;
     this.setPassword()
  }


}
