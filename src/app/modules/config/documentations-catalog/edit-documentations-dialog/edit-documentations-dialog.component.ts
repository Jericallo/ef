import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EditCompanyDialogComponent } from '../../companies/edit-company-dialog/edit-company-dialog.component';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-edit-documentations-dialog',
  templateUrl: './edit-documentations-dialog.component.html',
  styleUrls: ['./edit-documentations-dialog.component.scss']
})
export class EditDocumentationsDialogComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  document:{id:string, name:string}

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<EditCompanyDialogComponent>, public snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.document = {...data.documentation}
  }

  ngOnInit(): void {
  }

  updateDocument() {
    this.apiService.editDocumentations({name:this.document.name}, this.document.id).subscribe({
      next: (response) => {
        console.log('Documento actualizado exitosamente:', response);
        this.snackBar.open('Documento actualizado exitosamente', '', this.config_snack);
        this.dialogRef.close(); 
      },
      error: (error) => {
        console.error('Error al actualizar el documento:', error);
      }
    });
  }

}
