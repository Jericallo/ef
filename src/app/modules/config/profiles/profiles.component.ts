import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { RemoveProfileDialogComponent } from './remove-profile-dialog/remove-profile-dialog.component';
import { AddProfileDialogComponent } from './add-profile-dialog/add-profile-dialog.component';
import { EditProfileDialogComponent } from './edit-profile-dialog/edit-profile-dialog.component';
import { AddPermissionDialogComponent } from './add-permission-dialog/add-permission-dialog.component';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  profileList = []
  permissions = []
  columnsToDisplay = ['id','nombre', 'modulos','fecha_creacion', 'permisos', 'acciones'];

  columnNames = {
    id: '#',
    nombre: 'Nombre',
    modulos: 'Modulo',     
    fecha_creacion: 'Fecha de creación',
    permisos: "Permisos",
    acciones: 'Acciones'
  };


  constructor(private apiService: ApiService, private datePipe: DatePipe, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getProfiles()
    this.getPermissions()
  }


  getProfiles(){
    this.apiService.getAll("perfiles").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.profileList = res.result;
        this.profileList.forEach(profile => {
          profile.fecha_creacion = this.datePipe.transform(profile.fecha_creacion, 'dd/MM/yy');
        });
        this.dataSource = new MatTableDataSource<any>(this.profileList);

      }
    })
  }

  getPermissions(){
    this.apiService.getAll("perfiles_modulos").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.permissions = res.result;
        console.log(this.permissions)

      }
    })
  }

  getPermissionsText(element: any): string {
    const foundPermissions = this.permissions.filter(permission =>
      permission.id_perfil === element.id
    );
  
    if (foundPermissions.length === 0) {
      return 'Sin permisos';
    }
  
    return foundPermissions.map(permission => {
      return `${permission.permisos}`;
    }).join(' / ');
  }
  

  getModuleNames(profile: any): string {
    if (profile.modulos && profile.modulos.length > 0) {
      return profile.modulos.map(modulo => modulo.nombre).join(', ');
    }
    return '---';
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
        this.getProfiles();
      },
      (error) => {
        console.error('Error al eliminar el perfil:', error);
      }
    );
  }

  openAdd(){
    const dialogRef = this.dialog.open(AddProfileDialogComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getProfiles()
    });
 }

 openEdit(profile: any) {
  const dialogRef = this.dialog.open(EditProfileDialogComponent, {
    width: '1000px',
    data: { profile } 
  });
  dialogRef.afterClosed().subscribe((result) => {
      this.getProfiles();
  });
}

  openPermission(profile: any){
    const dialogRef = this.dialog.open(AddPermissionDialogComponent, {
      width: '1000px',
      data: { profile } 
    });
    dialogRef.afterClosed().subscribe((result) => {
        this.getProfiles();
        this.getPermissions()
    });  
  }
}
