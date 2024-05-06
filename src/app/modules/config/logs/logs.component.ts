import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;

  columnsToDisplay = ['user', 'action', 'date'];
  originalData: any[] = [];
  actions: string[] = ['POST', 'PUT', 'DELETE']; // Lista de movimientos únicos para el filtro

  columnNames = {
    user: 'Usuario',
    action: 'Movimiento',
    date: 'Fecha',
  };

  constructor( public apiService:ApiService) { }

  ngOnInit(): void {
    this.getActions()
  }

  getActions(){
    this.apiService.getAllLogs().subscribe({
      next: res => {
        this.originalData = res.result;
        this.dataSource = new MatTableDataSource<any>(res.result)
      }, error: err => {
        console.error(err)
      }
    })
  }

  getAction(element:any){
    let cadena = 'Se '
    if(element.method === 'POST') cadena += 'insertó '
    if(element.method === 'PUT') cadena += 'actualizó '
    if(element.method === 'DELETE') cadena += 'eliminó '

    const separatedURL = element.URL.split('/')
    cadena += separatedURL[separatedURL.length-1]
    return cadena
  }

  getDate(coso:string){
    const fecha = new Date(coso).getTime()
    return fecha
  }

  applyFilter(value: any, type: string) {
    if (type.toString() === 'date') {
      this.dataSource.data = this.originalData.filter(item => {
        const itemDate = new Date(item.created_at).getTime();
        const filterDate = new Date(value).getTime();
        return (itemDate > filterDate && itemDate < filterDate + 86400000);
      });
    }
    // Aplicar el filtro por movimiento
    if (type === 'action') {
      console.log(this.originalData, value)
      this.dataSource.data = this.originalData.filter(item => item.method === value);
    }
  }
}
