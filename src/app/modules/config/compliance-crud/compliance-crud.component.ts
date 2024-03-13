import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-compliance-crud',
  templateUrl: './compliance-crud.component.html',
  styleUrls: ['./compliance-crud.component.scss']
})
export class ComplianceCrudComponent implements OnInit {

  dataSource!: MatTableDataSource<any>;
  profileList = []
  permissions = []
  columnsToDisplay = ['id','nombre', 'descripcion','fecha_inicio', 'fecha_fin', 'prioridad'];
  filterValue: string;

  columnNames = {
    id: '#',
    nombre: 'Nombre',
    descripcion: 'Descripción',     
    fecha_inicio: 'Fecha de inicio',
    fecha_fin: "Fecha de finalización",
    prioridad: 'Prioridad'
  };

  constructor( public apiService: ApiService ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;


  ngOnInit(): void {
    this.getObligations()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator; // Asignamos el paginador a la dataSource
  }

  getObligations(date = new Date()) {
    let params = new HttpParams().set("day", (date.getTime() / 60000).toString());
    params = params.set('where', date.getTime().toString());
    params = params.set('id_usuario', this.apiService.getId().toString());
    this.apiService.dates(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'))
        console.log(res)
        this.dataSource = new MatTableDataSource<any>(res.result); // Inicializamos dataSource con los datos recibidos
        this.dataSource.paginator = this.paginator; // Asignamos el paginador a la dataSource
      },
      error: err => {
        console.log(err);
      }
    });
  }

  applyFilter(value: string) {
    this.filterValue = value;
    this.dataSource.filter = value.trim().toLowerCase(); // Aplicamos el filtro
  }

}
