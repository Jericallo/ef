import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';


@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {

  profile: any;
  editedName = ''
  moduleList = []
  selectedModule: number = null; // Cambiado de number a any


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, public dialogRef: MatDialogRef<EditProfileDialogComponent>) {
    this.profile = { ...data.profile };
  }

  ngOnInit(): void {
    this.getModules()
  }

  getModules(){
    this.apiService.getAll("modulos").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.moduleList = res.result;
        console.log(this.moduleList)
      }
    })
  }

  updateProfile() {
    const editedProfile = {
      id: this.profile.id,
      nombre: this.profile.nombre,
     // modulos: [{ id: this.selectedModule, permisos: null }]
    };
    console.log(editedProfile)

    const body = { model: "perfiles", data: editedProfile }

    this.apiService.put(body).subscribe({
      next: (response) => {
        console.log('Perfil actualizado exitosamente:', response);
        this.dialogRef.close(); 

      },
      error: (error) => {
        console.error('Error al crear el perfil:', error);
      }
    });
  }

}
