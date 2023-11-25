import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { debounceTime, fromEvent } from 'rxjs';
import { ArticleRelation } from 'src/app/shared/interfaces/article-relation-interface';
import { SearchDocumentComponent } from 'src/app/shared/components/search-document/search-document.component';
import { DisplayModalComponent } from './display-modal/display-modal.component';
import { MatDialog } from '@angular/material/dialog';

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

  isShownComponent = false
  showResults = false;

  universalRow = null

  d = new Date()
  month = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  mes = this.month[this.d.getMonth()]
  mesMostrar = 'Mes actual'

  listOfArticles: ArticleRelation[] = [];

  constructor(private apiService:ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.create_table()
    this.getObligations()
    }

  getObligations(offset=0) {
    /*
    const date = new Date();
    let params = new HttpParams().set("where", date.getTime())
    params = params.set('id_usuario', this.apiService.getId())
    params = params.set('limit',21)
    params = params.set('offset',offset)
    console.log(params)
    this.apiService.getCumplimientos(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        if(res.result[0].data.length < 20) this.bandera = false
        console.log(this.bandera)
        res.result[0].data.forEach((element,index) => {

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
        this.bandera = false
        console.log(err);
      }
    });*/
    let params = new HttpParams().set("where", this.sendableDate.getTime())
    //params = params.set('id_usuario', this.apiService.getId())
    //params = params.set('limit',21)
    //params = params.set('offset',offset)
    console.log(params)
    this.apiService.getCumplimientosControl(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        console.log(res.result)
        this.dataSource = []
        res.result.forEach((element) => {
          const row = { 
            fixedColumn: element.cumplimientos_obligacion.id_cumplimiento,
            fixedColumn2: element.fecha_cumplimiento,
            fixedColumn3: {
              si: element.aplica_punto.si,
              no: element.aplica_punto.no,
              prioridad: element.aplica_punto.prioridad
            }, 
            fixedColumn4: {
              leyes:element.correlacion.leyes,
              leyesComp:element.correlacion.leyes,
              temario:element.correlacion.temario,
              busqueda:element.correlacion.busqueda,
              numeros:element.correlacion.numeros,
              impuestos:element.correlacion.impuestos,
              documentacion:element.correlacion.documentacion,
              caso_practico:element.correlacion.capacitaciones.caso_practico,
              textos:element.correlacion.capacitaciones.textos,
              preguntas_frecuentes:element.correlacion.capacitaciones.preguntas_frecuentes,
              mejores_practicas:element.correlacion.capacitaciones.mejores_practicas,
              un_minuto:'no',
              cinco_minutos:'no',
              quince_minutos:'no',
              treinta_minutos:'si',
              sesenta_minutos:'no',
              dictamen:element.correlacion.dictamen,
              semaforo:element.correlacion.semaforo,
              inconsistencias:element.correlacion.inconsistencias,
              sanciones_generales:element.correlacion.sanciones_generales_importantes,
              empresa:element.correlacion.sanciones_penales.empresa,
              persona:element.correlacion.sanciones_penales.persona
            }, 
            fixedColumn5: {
              fecha_cumplir:element.cumplimientos_obligacion.fecha_se_puede_cumplir,
              fecha_ideal:element.cumplimientos_obligacion.fecha_ideal,
              fecha_maxima:element.cumplimientos_obligacion.fecha_maxima,
              art:element.cumplimientos_obligacion.fundamento_legal.articulo,
              actualizado:element.cumplimientos_obligacion.fundamento_legal.actualizado_en,
              se_cumplio:element.cumplimientos_obligacion.se_cumplio,
              fecha_cumplio:element.cumplimientos_obligacion.fecha_cumplimiento
            },
            switch:false ,
    
            fixedColumnRec: element.id_cumplimiento_mensual,
            fixedColumnRec2: element.fecha_cumplimiento,
            fixedColumnRec3: {
              si: element.aplica_punto.si,
              no: element.aplica_punto.no,
              prioridad: element.aplica_punto.prioridad
            }, 
            fixedColumnRec4: {
              leyes:element.correlacion.leyes,
              leyesComp:element.correlacion.leyes,
              temario:element.correlacion.temario,
              busqueda:element.correlacion.busqueda,
              numeros:element.correlacion.numeros,
              impuestos:element.correlacion.impuestos,
              documentacion:element.correlacion.documentacion,
              caso_practico:element.correlacion.capacitaciones.caso_practico,
              textos:element.correlacion.capacitaciones.textos,
              preguntas_frecuentes:element.correlacion.capacitaciones.preguntas_frecuentes,
              mejores_practicas:element.correlacion.capacitaciones.mejores_practicas,
              un_minuto:'no',
              cinco_minutos:'no',
              quince_minutos:'no',
              treinta_minutos:'si',
              sesenta_minutos:'no',
              dictamen:element.correlacion.dictamen,
              semaforo:element.correlacion.semaforo,
              inconsistencias:element.correlacion.inconsistencias,
              sanciones_generales:element.correlacion.sanciones_generales_importantes,
              empresa:element.correlacion.sanciones_penales.empresa,
              persona:element.correlacion.sanciones_penales.persona
            }, 
            fixedColumnRec5: {
              fecha_cumplir:element.cumplimientos_obligacion.fecha_se_puede_cumplir,
              fecha_ideal:element.cumplimientos_obligacion.fecha_ideal,
              fecha_maxima:element.cumplimientos_obligacion.fecha_maxima,
              art:element.cumplimientos_obligacion.fundamento_legal.articulo,
              actualizado:element.cumplimientos_obligacion.fundamento_legal.actualizado_en,
              se_cumplio:element.cumplimientos_obligacion.se_cumplio,
              fecha_cumplio:element.cumplimientos_obligacion.fecha_cumplimiento
            },};

            row.fixedColumn2 = new Date(row.fixedColumn2).toDateString(); row.fixedColumnRec2 = row.fixedColumn2
            if(row.fixedColumn5.fecha_cumplir != null)row.fixedColumn5.fecha_cumplir = new Date(row.fixedColumn5.fecha_cumplir).toDateString(); row.fixedColumnRec5.fecha_cumplir = row.fixedColumn5.fecha_cumplir
            if(row.fixedColumn5.fecha_ideal != null)row.fixedColumn5.fecha_ideal = new Date(row.fixedColumn5.fecha_ideal).toDateString(); row.fixedColumnRec5.fecha_ideal = row.fixedColumn5.fecha_ideal
            if(row.fixedColumn5.fecha_maxima != null)row.fixedColumn5.fecha_maxima = new Date(row.fixedColumn5.fecha_maxima).toDateString(); row.fixedColumnRec5.fecha_maxima = row.fixedColumn5.fecha_maxima
            if(row.fixedColumn5.fecha_cumplio != null)row.fixedColumn5.fecha_cumplio = new Date(row.fixedColumn5.fecha_cumplio).toDateString(); row.fixedColumnRec5.fecha_cumplio = row.fixedColumn5.fecha_cumplio
            
            this.dataSource.push(row)
        })
      },
      error: err => {
        this.bandera = false
        console.log(err);
      }
    });

  }

  ngAfterViewInit() {
    /*let intervalo = setInterval(() => {
      console.log('LA BANDERA ES:',this.bandera)
      if(this.bandera) {this.loadMoreData()}
      else clearInterval(intervalo)
    }, 2000);*/
  }

  create_table(){
    this.dataSource = [];
    this.displayedColumns = [];
    this.fixedColumns = ['fixedColumn','fixedColumn2','fixedColumn3','fixedColumn4', 'fixedColumn5'];
    /*for (let i = 1; i <= 50; i++) {
      const columnName = `Column ${i}`;
      this.displayedColumns.push(columnName);
      this.fixedColumns.push(columnName);
    }*/
    //this.fixedColumns.push('fixedColumn4')
    
    for (let i = 1; i <= 10; i++) {
      const row = { 
        fixedColumn: `${i}`,
        fixedColumn2: `Enero - Diciembre 2023`,
        fixedColumn3: {
          si:'verdadero',
          no:'falso',
          prioridad:'17'
        }, 
        fixedColumn4: {
          leyes:'Codigo fiscal',
          temario:'Impuestos fiscales',
          busqueda:'No aplica',
          numeros:'romanos',
          impuestos:'sobre la renta',
          documentacion:'no aplica',
          caso_practico:'Evadir impuestos',
          textos:'no aplica',
          preguntas_frecuentes:'no',
          mejores_practicas:'HA',
          un_minuto:'no',
          cinco_minutos:'no',
          quince_minutos:'no',
          treinta_minutos:'si',
          sesenta_minutos:'no',
          dictamen:'ilegal',
          semaforo:'rojo',
          inconsistencias:'no aplica',
          sanciones_generales:'carcel eterna',
          empresa:'no',
          persona:'si'
        }, 
        fixedColumn5: {
          fecha_cumplir:'hoy',
          fecha_ideal:'ayer',
          fecha_maxima:'mañana',
          art:'14',
          actualizado:'2022',
          se_cumplio:'si',
          fecha_cumplio:'antier'
        },
        switch:false ,

        fixedColumnRec: `${i}`,
        fixedColumn2Rec: `Enero - Diciembre 2023`,
        fixedColumn3Rec: {
          si:'verdadero',
          no:'falso',
          prioridad:'17'
        }, 
        fixedColumn4Rec: {
          leyes:'Codigo fiscal',
          temario:'Impuestos fiscales',
          busqueda:'No aplica',
          numeros:'romanos',
          impuestos:'sobre la renta',
          documentacion:'no aplica',
          caso_practico:'Evadir impuestos',
          textos:'no aplica',
          preguntas_frecuentes:'no',
          mejores_practicas:'HA',
          un_minuto:'no',
          cinco_minutos:'no',
          quince_minutos:'no',
          treinta_minutos:'si',
          sesenta_minutos:'no',
          dictamen:'ilegal',
          semaforo:'rojo',
          inconsistencias:'no aplica',
          sanciones_generales:'carcel eterna',
          empresa:'no',
          persona:'si'
        }, 
        fixedColumn5Rec: {
          fecha_cumplir:'hoy',
          fecha_ideal:'ayer',
          fecha_maxima:'mañana',
          art:'14',
          actualizado:'2022',
          se_cumplio:'si',
          fecha_cumplio:'antier'
        },};

      this.dataSource.push(row);
      
    }
    
  }

  onSwitchChange(row: any) {
    console.log(row.switch)
    console.log(row.fixedColumn3)
    console.log(row.fixedColumnRec3)
    row.switch
    if (row.switch) {
      row.fixedColumn = ''
      row.fixedColumn2 = ''
      row.fixedColumn3 = ''
      row.fixedColumn4 = ''
      row.fixedColumn5 = ''
    } else {
      row.fixedColumn = row.fixedColumnRec
      row.fixedColumn2 = row.fixedColumnRec2
      row.fixedColumn3 = row.fixedColumnRec3
      row.fixedColumn4 = row.fixedColumnRec4
      row.fixedColumn5 = row.fixedColumnRec5
    }
  }

  monthNext(){
    const today = new Date()
    this.sendableDate.setMonth(this.sendableDate.getMonth()+1)
    if(this.sendableDate.getMonth() === today.getMonth() && this.sendableDate.getFullYear() === today.getFullYear()){
      this.mesMostrar = 'Mes Actual'
      this.getObligations()
    } else {
      if(this.sendableDate.getFullYear() === today.getFullYear()){
        this.mesMostrar = this.month[this.sendableDate.getMonth()]
      } else {
        this.mesMostrar = this.month[this.sendableDate.getMonth()] + ' ' + this.sendableDate.getFullYear()
      }
      this.getObligations()
    }
  }

  monthPrevious(){
    const today = new Date()
    this.sendableDate.setMonth(this.sendableDate.getMonth()-1)
    if(this.sendableDate.getMonth() === today.getMonth() && this.sendableDate.getFullYear() === today.getFullYear()){
      this.mesMostrar = 'Mes Actual'
      this.getObligations()
    } else {
      if(this.sendableDate.getFullYear() === today.getFullYear()){
        this.mesMostrar = this.month[this.sendableDate.getMonth()]
      } else {
        this.mesMostrar = this.month[this.sendableDate.getMonth()] + ' ' + this.sendableDate.getFullYear()
      }
      this.getObligations()
    }
  }

  loadMoreData(){
    //let data = []
    //this.dataSource.forEach((element) => {
      //data.push(element)
    //})
    this.dataSource = [];
    this.offset += 20
    this.getObligations(this.offset)
  }

  openArticleRef(row:any){
    if(this.isShownComponent == true){
      this.isShownComponent = false
    } else {
      this.isShownComponent = true
    }

    this.universalRow = row
    console.log(this.isShownComponent)
  }

  artReceived(art: any[]) {
    console.log(art)
    console.log(this.universalRow.fixedColumn)
    art.length == 0 ? this.showResults = false : this.showResults = true;
    this.listOfArticles = Object.assign(art)
    let ides = []
    art.forEach((element) => {
      ides.push(element.id)
    })
    const body = {data:{
      articulos:ides,
      id_cumplimiento:this.universalRow.fixedColumn
    }}
    console.log('CUERPO', body)

    this.apiService.relateCumplimientoArticulo(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        console.log('RESPONSE',res.result)
      },
      error: err => {
        this.bandera = false
        console.log(err);
      }
    });
  }

  closePanel(close: boolean){
    close ? this.isShownComponent = false : this.isShownComponent = true;
  }

  articleClicked(a:any){
    console.log('ARTICULO',a)
    const dialogRef = this.dialog.open(DisplayModalComponent, {
      data: a, // Pasar el objeto a la modal
    });
  }  
}
