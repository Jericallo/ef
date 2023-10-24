import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';

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

  d = new Date()
  month = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  mes = this.month[this.d.getMonth()]
  mesMostrar = 'Mes actual'

  constructor(private apiService:ApiService) {}

  ngOnInit(): void {
    this.create_table()
    this.getObligations()
    console.log(this.dataSource)
  }

  getObligations(offset=0) {
    const date = new Date();
    let params = new HttpParams().set("where", date.getTime())
    params = params.set('id_usuario', "29")
    params = params.set('limit',11)
    params = params.set('offset',offset)
    console.log(params)
    this.apiService.getCumplimientos(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        
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
  //solo sirvo para hacer commit
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

    for (let i = 1; i <= 10; i++) {
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

  derecha(){
    console.log('Derechando')
    this.offset += 10
    this.create_table()
    this.getObligations(this.offset)
  }

  izquierda(){
    console.log('Izquierdando')
    this.offset += 10
    this.create_table()
    this.getObligations(this.offset)
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
}
