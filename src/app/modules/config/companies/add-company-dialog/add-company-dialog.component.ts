import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-company-dialog',
  templateUrl: './add-company-dialog.component.html',
  styleUrls: ['./add-company-dialog.component.scss']
})
export class AddCompanyDialogComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  name:string
  social_reason:string
  rfc:string
  codigo_postal:string
  regimen_fiscal:string
  sabado:boolean

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddCompanyDialogComponent>, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  createProfile() {
    let explotacion = 0
    if(this.sabado === true) explotacion = 1

    const body = {
      nombre: this.name,
      razon_social:this.social_reason,
      rfc:this.rfc,
      codigo_postal:this.codigo_postal,
      regimen_fiscal: this.regimen_fiscal,
      trabaja_sabados: explotacion
    };

    this.apiService.postEmpresas(body).subscribe({
      next: (response) => {
        console.log('Empresa creada exitosamente:', response);
        this.snackBar.open('Empresa agregada exitosamente', '', this.config_snack);
        this.dialogRef.close(); 
      },
      error: (error) => {
        console.error('Error al crear el perfil:', error);
      }
    });
  }

  formatRFC() {
    // Convierte el RFC a mayúsculas
    this.rfc = this.rfc.toUpperCase();
  }
}
