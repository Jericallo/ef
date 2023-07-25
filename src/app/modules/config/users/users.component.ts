import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatTableDataSource } from '@angular/material/table';
import { AddUserDialogComponent } from '../add-user-dialog/add-user-dialog.component';
import { RemoveUserDialogComponent } from '../remove-user-dialog/remove-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface Columns {
  id: number,
  nombre: string,
  correo: string, 
  telefono: number,
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  usersList = []
  columnsToDisplay = ['id','nombre', 'correo','telefono', 'acciones'];

  columnNames = {
    id: '#',
    nombre: 'Nombre',
    correo: 'Correo',     
    telefono: 'Telefono',
    acciones: 'Acciones'
  };

  constructor(private apiService: ApiService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUsers()
  }

  openAdd(){
     this.dialog.open(AddUserDialogComponent, {
      width: '1000px',
    });
  }

  openRemove(user: any) {
    const dialogRef = this.dialog.open(RemoveUserDialogComponent, {
      width: '600px',
      data: { user }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteUser(user.id);
      }
    });
  }

  openEdit(){

  }

  getUsers(){
    this.apiService.getAll("usuarios").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.usersList = res.result;
        this.dataSource = new MatTableDataSource<any>(this.usersList);

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
  
}
