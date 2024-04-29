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
    console.log(permission)
    const existingPermissions = this.permissionsList.find(permission =>
      permission.id_perfil === this.data.profile.id &&
      permission.id_modulo === this.selectedModule
    );

    console.log(existingPermissions)
  
    if (existingPermissions) {
      return existingPermissions.permisos.includes(permission);
    }
  
    return false;
  }

  
  getModulesForProfile(){
    console.log(this.data.profile.perfiles_modulos)
    const moduleIdsInProfile = this.data.profile.perfiles_modulos.map(module => module.id_modulo);
    this.apiService.getModules().subscribe({
      next:res => {
        console.log(res, moduleIdsInProfile)
        this.moduleList = res.filter(module => moduleIdsInProfile.includes(module.id));
      }
    });
  }

    
  savePermissions() {
    if (this.selectedModule === null) {
      alert('Debes seleccionar un módulo');
      return;
    }  

    const selectedModule = this.data.profile.perfiles_modulos.find(module => module.id_modulo === this.selectedModule);
  
    if (selectedModule) {
      console.log(selectedModule)
      this.selectedModulePermissionId = selectedModule.id;
    }
  
    const selectedPermissions = Object.keys(this.permissions)
      .map(permission => (this.permissions[permission] ? permission : '-'))
      .join('-');
  
    const body = {
      id: this.selectedModulePermissionId,
      permisos: selectedPermissions
    };
  
    console.log(this.permissions, body)
    this.apiService.putPerfilesModulos(body).subscribe({
      next: (response) => {
        console.log('Permisos guardados exitosamente:', response);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error al guardar permisos:');
        console.log(JSON.parse(this.apiService.decrypt(error.error.message, 'private')))
      }
    });
  }

  runPermissions() {
    const selectedModule = this.data.profile.perfiles_modulos.find(module => module.id_modulo === this.selectedModule);
    console.log(selectedModule)

    if(selectedModule.permisos.includes('R')) this.permissions['R'] = true; else this.permissions['R'] = false
    if(selectedModule.permisos.includes('W')) this.permissions['W'] = true; else this.permissions['W'] = false
    if(selectedModule.permisos.includes('E')) this.permissions['E'] = true; else this.permissions['E'] = false
  }
}
