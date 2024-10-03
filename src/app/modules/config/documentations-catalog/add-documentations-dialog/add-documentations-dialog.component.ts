import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import { AddCompanyDialogComponent } from '../../companies/add-company-dialog/add-company-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-documentations-dialog',
  templateUrl: './add-documentations-dialog.component.html',
  styleUrls: ['./add-documentations-dialog.component.scss']
})
export class AddDocumentationsDialogComponent implements OnInit {
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  name:string

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddCompanyDialogComponent>, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  createDocumentation() {
    const body = {
      name: this.name,
    };

    this.apiService.addDocumentation(body).subscribe({
      next: (response) => {
        console.log('Documento creado exitosamente:', response);
        this.snackBar.open('Documento agregado exitosamente', '', this.config_snack);
        this.dialogRef.close(); 
      },
      error: (error) => {
        console.error('Error al crear el documento:', error);
      }
    });
  }
}
