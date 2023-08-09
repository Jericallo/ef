import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddModuleDialogComponent } from './add-module-dialog/add-module-dialog.component';
import { RemoveModuleDialogComponent } from './remove-module-dialog/remove-module-dialog.component';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  modulesList = []
  columnsToDisplay = ['id','nombre', 'opciones', 'submodulos', 'acciones'];

  columnNames = {
    id: '#',
    nombre: 'Nombre',
    opciones: 'Opciones',
    submodulos: 'Submodulos',
    acciones: 'acciones'
  };


  constructor(private apiService: ApiService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getModules()
  }


  getModules(){
    this.apiService.getAll("modulos").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.modulesList = res.result;
        this.dataSource = new MatTableDataSource<any>(this.modulesList);
        console.log(this.modulesList)
      }
    })
  }

  getOptionName(module: any): string {
    if (module.opciones && module.opciones.length > 0) {
      return module.opciones.map(modulo => modulo.subdominio).join(', ');
    }
    return '---';
  }

  getSubmoduleName(module: any): string {
    if (module.submodulos && module.submodulos.length > 0) {
      return module.submodulos.map(modulo => modulo.nombre).join(', ');
    }
    return '---';
  }

  openAdd(){
    this.dialog.open(AddModuleDialogComponent, {
     width: '1000px',
   });
 }

 openRemove(module: any) {
  const dialogRef = this.dialog.open(RemoveModuleDialogComponent, {
    width: '600px',
    data: { module }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result === true) {
      this.deleteModule(module.id);
    }
  });
}

deleteModule(profileId: number) {
  this.apiService.deleteModule(profileId).subscribe(
    () => {
      this.getModules();
    },
    (error) => {
      console.error('Error al eliminar el perfil:', error);
    }
  );
}


}
