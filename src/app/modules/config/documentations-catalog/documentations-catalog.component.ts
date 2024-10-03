import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { AddDocumentationsDialogComponent } from './add-documentations-dialog/add-documentations-dialog.component';
import { EditDocumentationsDialogComponent } from './edit-documentations-dialog/edit-documentations-dialog.component';

@Component({
  selector: 'app-documentations-catalog',
  templateUrl: './documentations-catalog.component.html',
  styleUrls: ['./documentations-catalog.component.scss']
})
export class DocumentationsCatalogComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  dataSource = [
    {id:1, nombre:'Acta de nacimiento'}
  ]

  columnsToDisplay = ['id','nombre', 'acciones'];

  columnNames = {
    id: '#',
    nombre: 'Nombre',
    acciones:'Acciones'
  };

  constructor(private apiService: ApiService, private datePipe: DatePipe, public dialog: MatDialog, public snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.getDocumentations()
  }

  getDocumentations(){
    this.apiService.getAllDocumentations().subscribe({
      next:res => {
        this.dataSource = res

      }
    })
  }

  deleteCompany(id:any) {
    Swal.fire({
      title: "¿Seguro que desea borrar el documento?",
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton:false,
      denyButtonText: `Borrar`,
      cancelButtonText:'Cancelar'
    }).then((result) => {
      if (result.isDenied) {
        this.apiService.deleteDocumentations(id.toString()).subscribe({
          next:res => {
            console.log(res)
            this.getDocumentations()
            this.snackBar.open('Documento borrado exitosamente', '', this.config_snack);
          }
        })
      } 
    });
  }

  openAdd(){
    const dialogRef = this.dialog.open(AddDocumentationsDialogComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getDocumentations()
    });
  }

  openEdit(documentation: any) {
    const dialogRef = this.dialog.open(EditDocumentationsDialogComponent, {
      width: '1000px',
      data: { documentation } 
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.getDocumentations();
    });
  }

}
