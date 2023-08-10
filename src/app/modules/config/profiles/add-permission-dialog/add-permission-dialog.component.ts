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

  constructor(public dialogRef: MatDialogRef<AddPermissionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { profile: any }, private apiService: ApiService) { }

  ngOnInit(): void {
    this.getModulesForProfile();
  }

  getModulesForProfile(){
    const moduleIdsInProfile = this.data.profile.modulos.map(module => module.id);

    console.log(this.data.profile)

    this.apiService.getAll("modulos").subscribe({
      next:res => {
        console.log(res)
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        this.moduleList = res.result.filter(module => moduleIdsInProfile.includes(module.id));
        console.log(this.moduleList)
      }
    });
  }

  savePermissions() {
    if (this.selectedModule === null) {
      console.error('Debes seleccionar un módulo');
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
