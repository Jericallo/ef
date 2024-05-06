import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { isSameDay } from 'date-fns';

@Component({
  selector: 'app-edit-module-dialog',
  templateUrl: './edit-module-dialog.component.html',
  styleUrls: ['./edit-module-dialog.component.scss']
})
export class EditModuleDialogComponent implements OnInit {

  editedModuleName = ''
  moduleList: any[] = [];
  editedOrder = 0
  selectedModule: null;


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService, public dialogRef: MatDialogRef<EditModuleDialogComponent>) { }

  ngOnInit(): void {
    if (this.data.moduleData) {
      this.editedModuleName = this.data.moduleData.nombre;
      this.editedOrder = +this.data.moduleData.orden;
      this.selectedModule = this.data.moduleData.modulo_padre;
  
      // Filtra la lista de módulos para excluir el módulo que se esta editando
      this.moduleList = this.data.moduleList.filter(module => module.id !== this.data.moduleData.id);
    }
  }
  
  removeSubmodule(index: number) {
    console.log(this.data.moduleData.submodulos)
    const removedSubmoduleId = this.data.moduleData.submodulos[index].id; // Obtiene el id del submódulo eliminado

    const editedSub = {
      id: removedSubmoduleId,
      modulo_padre: null
    }

    const body = { model: "modulos", data: editedSub };
    this.apiService.put(body).subscribe({
      next: (response) => {
        console.log('Módulo actualizado exitosamente:', response);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error al actualizar el Módulo:', error);
      }
    });
}

editSubmoduleName(index: number) {
  console.log(this.data.moduleData.other_modulos)
  const removedSubmoduleId = this.data.moduleData.other_modulos[index].id; 
  const newName= this.data.moduleData.other_modulos[index].nombre

  const editedSub = {
    id: removedSubmoduleId,
    nombre: newName
  }

  this.apiService.putModules(editedSub).subscribe({
    next: (response) => {
      console.log('Módulo actualizado exitosamente:', response);
      this.dialogRef.close();
    },
    error: (error) => {
      console.error('Error al actualizar el Módulo:', error);
    }
  });
}

  
  editModule() {
    const editedModule = {
      id: this.data.moduleData.id,
      nombre: this.editedModuleName,
      orden: this.editedOrder.toString(),
      modulo_padre: this.selectedModule,
    };
    
    const body = { model: "modulos", data: editedModule };
    this.apiService.put(body).subscribe({
      next: (response) => {
        console.log('Módulo actualizado exitosamente:', response);
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error al actualizar el Módulo:', error);
      }
    });
  }
  
}
