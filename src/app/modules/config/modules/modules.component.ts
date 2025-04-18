import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddModuleDialogComponent } from './add-module-dialog/add-module-dialog.component';
import { RemoveModuleDialogComponent } from './remove-module-dialog/remove-module-dialog.component';
import { EditModuleDialogComponent } from './edit-module-dialog/edit-module-dialog.component';

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
    this.apiService.getModules().subscribe({
      next:res => {
        //res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.modulesList = res;
        this.dataSource = new MatTableDataSource<any>(this.modulesList);
        console.log(this.modulesList)
      }
    })
  }

  getOptionName(module: any): string {
    if (module.modulos_opciones && module.modulos_opciones.length > 0) {
      return module.modulos_opciones.map(modulo => modulo.subdominio).join(', ');
    }
    return '---';
  }

  getSubmoduleName(module: any): string {
    if (module.other_modulos && module.other_modulos.length > 0) {
      return module.other_modulos.map(modulo => modulo.nombre).join(', ');
    }
    return '---';
  }

  openAdd(){
    const dialogRef = this.dialog.open(AddModuleDialogComponent, {
     width: '1000px',
   });
   dialogRef.afterClosed().subscribe((result) => {
   this.getModules()
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

openEdit(element: any) {
  const dialogRef = this.dialog.open(EditModuleDialogComponent, {
    data: {
      moduleData: element,
      moduleList: this.modulesList
    },
    width:'800px'
  });

  dialogRef.afterClosed().subscribe(result => {
    this.getModules()
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
