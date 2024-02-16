import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-module-dialog',
  templateUrl: './add-module-dialog.component.html',
  styleUrls: ['./add-module-dialog.component.scss']
})
export class AddModuleDialogComponent implements OnInit {

  @ViewChild('orderInput') orderInput: any;

  newModuleName = ''
  moduleList = [];
  newOrder = 0
  selectedModule: number;

  

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AddModuleDialogComponent>) { }

  ngOnInit(): void {
    this.getModules();
  }

  getModules(){
    this.apiService.getAll("modulos").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()));
        this.moduleList = res.result;
      }
    });
  }

  createModule() {
    const newModule = {
      nombre: this.newModuleName,
      orden: this.newOrder.toString() || "0",
      modulo_padre: this.selectedModule
    };
    const body = { model: "modulos", data: newModule };
    this.apiService.post(body).subscribe({
      next: (response) => {
        console.log('Modulo creado exitosamente:', response);
        this.dialogRef.close(); 
      },
      error: (error) => {
        console.error('Error al crear el Modulo:', error);
      }
    });
  }
}
