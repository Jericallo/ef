import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-edit-company-dialog',
  templateUrl: './edit-company-dialog.component.html',
  styleUrls: ['./edit-company-dialog.component.scss']
})
export class EditCompanyDialogComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  name:string
  social_reason:string
  rfc:string
  codigo_postal:string
  regimen_fiscal:string
  sabado:boolean

  company:any

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<EditCompanyDialogComponent>, public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,) { 
    this.company = {...data.company}
  }

  ngOnInit(): void {
  }

  updateProfile() {
    this.apiService.putEmpresas(this.company).subscribe({
      next: (response) => {
        console.log('Empresa creada exitosamente:', response);
        this.snackBar.open('Empresa actualizada exitosamente', '', this.config_snack);
        this.dialogRef.close(); 
      },
      error: (error) => {
        console.error('Error al crear el perfil:', error);
      }
    });
  }
  
  formatRFC() {
    // Convierte el RFC a mayúsculas
    this.company.rfc = this.company.rfc.toUpperCase();
  }


}
