import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';
import { RemoveProfileDialogComponent } from '../profiles/remove-profile-dialog/remove-profile-dialog.component';
import { EditProfileDialogComponent } from '../profiles/edit-profile-dialog/edit-profile-dialog.component';
import { AddCompanyDialogComponent } from './add-company-dialog/add-company-dialog.component';
import Swal from 'sweetalert2';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { EditCompaniesDialogComponent } from './edit-companies-dialog/edit-companies-dialog.component';
import { EditCompanyDialogComponent } from './edit-company-dialog/edit-company-dialog.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  dataSource = [
    {id:1, nombre:'PepsiCo', razon_social:'No sé', rfc:'AB12393JDF1', codigo_postal:'45050', regimen_fiscal:'No sé pt.2', trabaja_sabados:1, estatus:1}
  ]

  columnsToDisplay = ['id','nombre', 'razon_social','rfc', 'codigo_postal', 'regimen_fiscal', 'sabado', 'acciones'];

  columnNames = {
    id: '#',
    nombre: 'Nombre',
    razon_social: 'Razón Social',     
    rfc: 'RFC',
    codigo_postal: "Código Postal",
    regimen_fiscal: 'Régimen Fiscal',
    direccion: 'Dirección',
    correo: 'Correo',
    telefono: 'Teléfono',
    sabado: '¿Trabaja los Sábados?',
    acciones:'Acciones'
  };


  constructor(private apiService: ApiService, private datePipe: DatePipe, public dialog: MatDialog, public snackBar: MatSnackBar ) { }

  ngOnInit(): void {
    this.getCompanies()
  }


  getCompanies(){
    this.apiService.getEmpresas().subscribe({
      next:res => {
        console.log(res)
        this.dataSource = res.result

      }
    })
  }


  deleteCompany(profileId: number) {
    const body = {
      id: profileId
    }

    Swal.fire({
      title: "¿Seguro que desea borrar la empresa?",
      showDenyButton: true,
      showCancelButton: true,
      showConfirmButton:false,
      denyButtonText: `Borrar`,
      cancelButtonText:'Cancelar'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isDenied) {
        this.apiService.deleteEmpresas(body).subscribe({
          next:res => {
            console.log(res)
            //res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
            this.getCompanies()
            this.snackBar.open('Empresa borrada exitosamente', '', this.config_snack);
          }
        })
      } 
    });
  }

  openAdd(){
    const dialogRef = this.dialog.open(AddCompanyDialogComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getCompanies()
    });
  }

  openEdit(company: any) {
    const dialogRef = this.dialog.open(EditCompanyDialogComponent, {
      width: '1000px',
      data: { company } 
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.getCompanies();
    });
  }

  sabadazo(trabaja_sabados:number):string{
    if(trabaja_sabados === 1) return 'Si'
    else return 'No'
  }
}
