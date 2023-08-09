import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-profile-dialog',
  templateUrl: './add-profile-dialog.component.html',
  styleUrls: ['./add-profile-dialog.component.scss']
})
export class AddProfileDialogComponent implements OnInit {

  moduleList = [];
  selectedModules: { [moduleId: number]: boolean } = {}; // Usamos un objeto para almacenar las selecciones
  newProfileName = '';

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddProfileDialogComponent>) { }

  ngOnInit(): void {
    this.getModules();
  }

 public getModules(){
    this.apiService.getAll("modulos").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()));
        this.moduleList = res.result;
      }
    });
  }

  createProfile() {
    const selectedModuleIds = Object.keys(this.selectedModules)
      .filter(moduleId => this.selectedModules[moduleId])
      .map(Number);

    const newProfile = {
      nombre: this.newProfileName,
      modulos: selectedModuleIds.map(id => ({ id, permisos: null }))
    };

    const body = { model: "perfiles", data: newProfile };

    this.apiService.post(body).subscribe({
      next: (response) => {
        console.log('Perfil creado exitosamente:', response);
        this.dialogRef.close(); 
      },
      error: (error) => {
        console.error('Error al crear el perfil:', error);
      }
    });
  }
}
