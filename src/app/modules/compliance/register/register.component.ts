import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  dataSource: any[];
  displayedColumns: string[];
  fixedColumns: string[];
  offset = 0
  derechaHabilitado = false
  izquierdaHabilitado = false

  sendableDate: Date = new Date();
  bandera = true

  d = new Date()
  month = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  mes = this.month[this.d.getMonth()]
  mesMostrar = 'Mes actual'

  constructor(private apiService:ApiService) {}

  ngOnInit(): void {
    this.create_table()
    this.getObligations()
  }

  getObligations(offset=0) {
    const date = new Date();
    let params = new HttpParams().set("where", date.getTime())
    params = params.set('id_usuario', "29")
    params = params.set('limit',21)
    params = params.set('offset',offset)
    console.log(params)
    this.apiService.getCumplimientos(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        if(res.result.length < 20) this.bandera = false
        res.result.forEach((element,index) => {

          this.dataSource[index].fixedColumn = element.cumplimiento.descripcion
          this.dataSource[index].fixedColumn2 = element.cumplimiento.tipo.nombre

          this.dataSource[index].fixedColumnRec = element.cumplimiento.descripcion
          this.dataSource[index].fixedColumn2Rec = element.cumplimiento.tipo.nombre

          element.cumplimiento.obligaciones.forEach((element2,index2) => {
            const aux = this.dataSource[index]
            aux[`Column ${index2 + 1}`] = element2.nombre
            aux[`Column ${index2 + 1} Rec`] = element2.nombre
            this.dataSource[index] = aux
          })
        });

        console.log(res)
        if(res.result.length < 10){
          this.derechaHabilitado = true
        }
        if(this.offset === 0){
          this.izquierdaHabilitado = true
        }
      },
      error: err => {
        console.log(err);
      }
    });
  }

  create_table(){
    this.dataSource = [];
    this.displayedColumns = [];
    this.fixedColumns = ['fixedColumn','fixedColumn2','fixedColumn3','fixedColumn4'];
    for (let i = 1; i <= 50; i++) {
      const columnName = `Column ${i}`;
      this.displayedColumns.push(columnName);
      this.fixedColumns.push(columnName);
    }
    //this.fixedColumns.push('fixedColumn4')

    for (let i = 1; i <= 20; i++) {
      const row = { fixedColumn: `Row ${i}`,
        fixedColumn2: `Rowf2 ${i}`,
        fixedColumn3: `Rowff ${i}`, 
        fixedColumnRec:`Row ${i}`, 
        fixedColumn2Rec: `Rowf2 ${i}`,
        fixedColumn3Rec:`Rowff ${i}`};
      for (let j = 1; j <= 50; j++) {
        const columnName = `Column ${j}`;
        const columnRec = `Column ${j} Rec`
        row[columnName] = `${columnName} - Row ${i}`;
        row[columnRec] = `${columnName} - Row ${i}`;
      }
      row['switch'] = true
      row['textColor'] = 'black'

      this.dataSource.push(row);
      
    }
  }

  onSwitchChange(row: any) {
    console.log(row)
    row.switch
    if (!row.switch) {
      for(let i = 1; i <= 50; i++){
        row[`Column ${i}`] = ''
      }
    } else {
      for(let i = 1; i <= 50; i++){
        row[`Column ${i}`] = row[`Column ${i} Rec`]
      }
    }
  }

  monthNext(){
    const today = new Date()

    this.sendableDate.setMonth(this.sendableDate.getMonth()+1)
    if(this.sendableDate.getMonth() === today.getMonth()){
      this.mesMostrar = 'Mes Actual'
    } else {
      this.mesMostrar = this.month[this.sendableDate.getMonth()]
    }
  }

  monthPrevious(){
    const today = new Date()

    this.sendableDate.setMonth(this.sendableDate.getMonth()-1)
    if(this.sendableDate.getMonth() === today.getMonth()){
      this.mesMostrar = 'Mes Actual'
    } else {
      this.mesMostrar = this.month[this.sendableDate.getMonth()]
    }
  }

  loadMoreData(){
    let data = []
    this.dataSource.forEach((element) => {
      data.push(element)
    })
    this.dataSource = [];

    if(this.bandera === true){
      console.log('bandera')
      this.offset += 20
      this.getObligations(this.offset)
    } else {
      for (let i = 21; i <= 40; i++) {
        const row = { fixedColumn: `Row ${i}`,
          fixedColumn2: `Rowf2 ${i}`,
          fixedColumn3: `Rowff ${i}`, 
          fixedColumnRec:`Row ${i}`, 
          fixedColumn2Rec: `Rowf2 ${i}`,
          fixedColumn3Rec:`Rowff ${i}`};
        for (let j = 1; j <= 50; j++) {
          const columnName = `Column ${j}`;
          const columnRec = `Column ${j} Rec`
          row[columnName] = `${columnName} - Row ${i}`;
          row[columnRec] = `${columnName} - Row ${i}`;
        }
        row['switch'] = true
        row['textColor'] = 'black'
  
        data.push(row);
      }

      data.forEach((element) => {
        this.dataSource.push(element)
      })
    }
  }

}
