import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-add-permission-dialog',
  templateUrl: './add-permission-dialog.component.html',
  styleUrls: ['./add-permission-dialog.component.scss']
})
export class AddPermissionDialogComponent implements OnInit {

  moduleList: any[] = [];
  selectedModule: number | null = null;
  selectedModulePermissionId: number | null = null;
  permissions: { [key: string]: boolean } = {
    'R': false,
    'W': false,
    'E': false
  };

  permissionsList = []


  constructor(public dialogRef: MatDialogRef<AddPermissionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { profile: any }, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getPermissions()
    this.getModulesForProfile();
  }

  getPermissions(){
    this.apiService.getAll("perfiles_modulos").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.permissionsList = res.result;
      }
    })
  }

  
  permissionsListIncludes(permission: string): boolean {
    const existingPermissions = this.permissionsList.find(permission =>
      permission.id_perfil === this.data.profile.id &&
      permission.id_modulo === this.selectedModule
    );
  
    if (existingPermissions) {
      return existingPermissions.permisos.includes(permission);
    }
  
    return false;
  }

  
  getModulesForProfile(){
    const moduleIdsInProfile = this.data.profile.modulos.map(module => module.id);
    this.apiService.getAll("modulos").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        this.moduleList = res.result.filter(module => moduleIdsInProfile.includes(module.id));
      }
    });
  }

    
  savePermissions() {
    if (this.selectedModule === null) {
      alert('Debes seleccionar un módulo');
      return;
    }  

    const selectedModule = this.data.profile.modulos.find(module => module.id === this.selectedModule);
  
    if (selectedModule) {
      this.selectedModulePermissionId = selectedModule.id_permiso;
    }
  
    const selectedPermissions = Object.keys(this.permissions)
      .map(permission => (this.permissions[permission] ? permission : '-'))
      .join('-');
  
    const modulePermission = {
      id: this.selectedModulePermissionId,
      id_perfil: this.data.profile.id,
      id_modulo: this.selectedModule,
      permisos: selectedPermissions
    };
  
    const body = { model: "perfiles_modulos", data: modulePermission };
  
    this.apiService.put(body).subscribe({
      next: (response) => {
        console.log('Permisos guardados exitosamente:', response);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error al guardar permisos:', error);
      }
    });
  }
  
}
