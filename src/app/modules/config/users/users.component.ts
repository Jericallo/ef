import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatTableDataSource } from '@angular/material/table';

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
  columnsToDisplay = ['id','nombre', 'correo','telefono'];

  columnNames = {
    id: '#',
    nombre: 'Nombre',
    correo: 'Correo',
    telefono: 'Telefono',
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getUsers()
  }

  getUsers(){
    this.apiService.getAll("usuarios").subscribe({
      next:res => {
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        this.usersList = res.result;
        console.log(this.usersList)
        this.dataSource = new MatTableDataSource<any>(this.usersList);

      }
    })
  }
}
