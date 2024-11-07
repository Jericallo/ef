import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';
import { AddQuestionDialogComponent } from './add-question-dialog/add-question-dialog.component';
import { EditQuestionDialogComponent } from './edit-question-dialog/edit-question-dialog.component';
import { RemoveQuestionComponent } from './remove-question/remove-question.component';

interface Columns {
  id: number,
  nombre: string,
  correo: string, 
  telefono: number,
}

@Component({
  selector: 'app-monthly-questionar',
  templateUrl: './monthly-questionar.component.html',
  styleUrls: ['./monthly-questionar.component.scss']
})
export class MonthlyQuestionarComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  usersList = []
  columnsToDisplay = ['pregunta', 'agregado_por', 'fecha', 'acciones'];

  columnNames = {
    pregunta: 'Pregunta',   
    agregado_por: 'Agregado por',
    fecha: 'Fecha de creación',
    acciones:'acciones'
  };

  constructor(private apiService: ApiService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsers()
  }

  openAdd() {
    const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getUsers();
    });
  }
  
  openRemove(user: any) {
    const dialogRef = this.dialog.open(RemoveQuestionComponent, {
      width: '600px',
      data: { user }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteUser(user.id);
      }
    });
  }

  openEdit(user: any) {
    const dialogRef = this.dialog.open(EditQuestionDialogComponent, {
      width: '600px',
      data: { user }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getUsers()
    });
  }

  getUsers(){
    this.apiService.getUsers().subscribe({
      next:res => {
        console.log(res)
        this.usersList = res;
        this.dataSource = new MatTableDataSource<any>(this.usersList);
        console.log(res.result)
      }
    })
  }

  deleteUser(userId: number) {
    this.apiService.deleteUser(userId).subscribe(
      () => {
        this.getUsers();
      },
      (error) => {
        console.error('Error al eliminar el usuario:', error);
      }
    );
  }

  parseRoles(role:string):string{
    switch(role){
      case 'GlobalBusinessComplianceSupervisorRole':
        return 'Supervisor de cumplimiento de Global Business'
      case 'PayrollComplianceSupervisorRole':
        return 'Encargado de nóminas'
      default:
        return role
    }
  }

}
