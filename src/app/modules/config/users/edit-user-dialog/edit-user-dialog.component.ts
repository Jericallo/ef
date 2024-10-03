
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

interface Usuario {
  id: string;
  email: string;
  password: string;
  name: string; 
  phoneNumber: string;
  roles: string[]; 
}

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.component.html',
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent implements OnInit {
  perfiles = []
  selectedOption: string = ''

  editedUser: Usuario = {
    id: '',
    email: '',
    password:'', 
    name: '',
    phoneNumber: '',
    roles:[] 
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
    this.getProfiles()
    
  }

  getProfiles(){
    this.apiService.getProfiles().subscribe(
      (response) => {
        this.perfiles = response
        this.selectProfile()
      },
      (error) => {
        console.error('Error al agregar el usuario', error);
      }
    );
  }

  selectProfile() {
    if (this.editedUser && this.perfiles) {
      console.log('seleccionando...')
      this.selectedOption = this.editedUser.roles[0];
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveUser() {
    if (this.camposSonValidos()) {
      const body:Usuario = this.editedUser
      body.phoneNumber = (body.phoneNumber).toString()
      console.log(body)
      this.apiService.putUser(body, body.id).subscribe(
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

  camposSonValidos(): boolean {
    return (
      this.emailPattern.test(this.editedUser.email.trim()) &&
      this.editedUser.name.trim() !== '' &&
      this.phonePattern.test(this.editedUser.phoneNumber.toString()));
  }

  onPerfilChange(event) {
    this.editedUser.roles[0] = event.value
  }
}

