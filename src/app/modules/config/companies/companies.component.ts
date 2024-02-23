import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';
import { RemoveProfileDialogComponent } from '../profiles/remove-profile-dialog/remove-profile-dialog.component';
import { EditProfileDialogComponent } from '../profiles/edit-profile-dialog/edit-profile-dialog.component';
import { AddCompanyDialogComponent } from './add-company-dialog/add-company-dialog.component';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  dataSource = [
    {id:1, nombre:'PepsiCo', razon_social:'No sé', rfc:'AB12393JDF1', codigo_postal:'45050', regimen_fiscal:'No sé pt.2', direccion:'Prados albinos 1433', correo:'pepsi@pepsi.com', telefono: '3336623640', sabado:'si'}
  ]

  columnsToDisplay = ['id','nombre', 'razon_social','rfc', 'codigo_postal', 'regimen_fiscal', 'direccion', 'correo', 'telefono', 'sabado', 'acciones'];

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


  constructor(private apiService: ApiService, private datePipe: DatePipe, public dialog: MatDialog) { }

  ngOnInit(): void {
    //this.getCompanies()
  }


  getCompanies(){
    this.apiService.getProfiles().subscribe({
      next:res => {
        console.log(res)


      }
    })
  }

  openRemove(profile: any) {
    const dialogRef = this.dialog.open(RemoveProfileDialogComponent, {
      width: '600px',
      data: { profile }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteProfile(profile.id);
      }
    });
  }

  deleteProfile(profileId: number) {
    this.apiService.deleteProfile(profileId).subscribe(
      () => {
        this.getCompanies();
      },
      (error) => {
        console.error('Error al eliminar el perfil:', error);
      }
    );
  }

  openAdd(){
    const dialogRef = this.dialog.open(AddCompanyDialogComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getCompanies()
    });
  }

  openEdit(profile: any) {
    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '1000px',
      data: { profile } 
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.getCompanies();
    });
  }
}
