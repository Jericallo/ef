import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-company-dialog',
  templateUrl: './add-company-dialog.component.html',
  styleUrls: ['./add-company-dialog.component.scss']
})
export class AddCompanyDialogComponent implements OnInit {

  name:string
  social_reason:string
  rfc:string
  codigo_postal:string
  regimen_fiscal:string
  direccion:string
  correo:string
  telefono:string
  sabado:boolean

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddCompanyDialogComponent>) { }

  ngOnInit(): void {
  }

  createProfile() {


    const body = {};

    this.apiService.createProfile(body).subscribe({
      next: (response) => {
        console.log('Perfil creado exitosamente:', response);
        this.dialogRef.close(); 
      },
      error: (error) => {
        console.error('Error al crear el perfil:', error);
      }
    });
    
  }
}
