import { Component, ElementRef, HostListener, LOCALE_ID, OnInit, Renderer2, ViewChild } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ApiService } from 'src/app/shared/services/api.service';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { debounceTime, fromEvent } from 'rxjs';
import { ArticleRelation } from 'src/app/shared/interfaces/article-relation-interface';
import { SearchDocumentComponent } from 'src/app/shared/components/search-document/search-document.component';
import { SearchDocumentationComponent } from 'src/app/shared/components/search-documentation/search-documentation.component';
import { DisplayModalComponent } from './display-modal/display-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }] 
})

export class RegisterComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  dataSource = new MatTableDataSource()
  displayedColumns: string[];
  fixedColumns: string[];
  offset = 0
  derechaHabilitado = false
  izquierdaHabilitado = false

  sendableDate: Date = new Date();
  bandera = true

  isShownComponent = false
  isShownTopics = false
  showResults = false;
  isShownDocumentation = false
  isShownCapacitations = false

  universalRow = null
  extArticulos = ''

  d = new Date()
  month = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  mes = this.month[this.d.getMonth()]
  mesMostrar = 'Mes actual'

  listOfArticles: ArticleRelation[] = [];
  sentDocumentations = null
  sentCapacitations = null

  sending = ['hola','adios']

  selectedDate:Date

  constructor(private apiService:ApiService, public dialog: MatDialog) {}

  ngOnInit(): void {
    
    this.create_table()
    this.getObligations()
    this.dataSource.sort = this.sort
    }

  getObligations(offset=0, orderby='') {
    this.dataSource.data = []

    let params = new HttpParams().set("where", this.sendableDate.getTime())
    if(orderby !== '') params = params.set('secOrderBy', orderby)
    //params = params.set('limit',21)
    //params = params.set('offset',offset)
    console.log(params)
    this.apiService.getCumplimientosControl(params).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        console.log(res.result)
        this.dataSource.data = []
        let rows = []
        res.result.forEach((element) => {
          const row = { 
            content:{
              id_cumplimiento:element.cumplimientos_obligacion.id_cumplimiento,
              color:'',

              descripcion:element.descripcion,
              nombre:element.nombre,
              fecha_cumplimiento: element.fecha_cumplimiento,
              switch:false ,

              ISR:element.cumplimientos_obligacion.impuestos.impuesto_isr,
              IVA:element.cumplimientos_obligacion.impuestos.impuesto_iva,
              NOMINA:element.cumplimientos_obligacion.impuestos.impuesto_nomina,
              OTRO:element.cumplimientos_obligacion.impuestos.impuesto_otro,

              si: element.aplica_punto.si,
              no: element.aplica_punto.no,
              prioridad: element.cumplimientos_obligacion.prioridad,

              fecha_inicio_cumplimiento: element.cumplimientos_obligacion.fecha_inicio_cumplimiento,
              fecha_inicio_cumplimiento_fin: element.cumplimientos_obligacion.fecha_inicio_cumplimiento_fin,
              fecha_cumplir:element.cumplimientos_obligacion.fecha_se_puede_cumplir,
              fecha_ideal:element.cumplimientos_obligacion.fecha_ideal,
              fecha_ideal_fin:element.cumplimientos_obligacion.fecha_ideal_fin,
              fecha_maxima:element.cumplimientos_obligacion.fecha_maxima,
              fecha_maxima_fin:element.cumplimientos_obligacion.fecha_maxima_fin,
              fecha_habilitacion: element.cumplimientos_obligacion.fecha_habilitacion,
              fecha_inicio_ideal: element.cumplimientos_obligacion.fecha_inicio_ideal,
              fecha_inicio_ideal_fin: element.cumplimientos_obligacion.fecha_inicio_ideal_fin,

              se_cumplio:'',
              fecha_cumplio:element.cumplimientos_obligacion.fecha_cumplimiento,

              documentos_faltantes:element.documentos_evidencia.documentacion_faltante,
              documentos_fecha_ideal:element.documentos_evidencia.fecha_ideal,
              documentos_fecha_maxima:element.documentos_evidencia.fecha_maxima,
              documentos_en_tiempo:element.documentos_evidencia.en_tiempo,
              documentos_documentacion_suficiente:element.documentos_evidencia.documentación_suficiente,
              registro_general:element.documentos_evidencia.registro_general,

              nivel:element.documentacion_evidencia.prioridad,
              recordatorios:element.documentacion_evidencia.recordatorios,
              alertas:element.documentacion_evidencia.alertas_incumplimiento,
              reporte_via_semaforo:element.documentacion_evidencia.reporte_via_semaforo,

              leyes:element.correlacion.leyes,
              temario:element.correlacion.temario,
              busqueda:element.correlacion.busqueda,
              numeros:element.correlacion.numeros,
              impuestos:element.correlacion.impuestos,
              documentacion:element.correlacion.documentacion,
              
              caso_practico:element.correlacion.capacitaciones.caso_practico,
              textos:element.correlacion.capacitaciones.textos,
              preguntas_frecuentes:element.correlacion.capacitaciones.preguntas_frecuentes,
              mejores_practicas:element.correlacion.capacitaciones.mejores_practicas,
              un_minuto:element.correlacion.capacitaciones.min1,
              cinco_minutos:element.correlacion.capacitaciones.min5,
              quince_minutos:element.correlacion.capacitaciones.min15,
              treinta_minutos:element.correlacion.capacitaciones.min30,
              sesenta_minutos:element.correlacion.capacitaciones.min60,

              dictamen:element.correlacion.dictamen,
              semaforo:element.correlacion.semaforo,
              inconsistencias:element.correlacion.inconsistencias,
              
              sanciones_generales:element.correlacion.sanciones_generales_importantes,
              empresa:element.correlacion.sanciones_penales.empresa,
              persona:element.correlacion.sanciones_penales.persona,

              fundamento_legal:element.cumplimientos_obligacion.fundamento_legal,
              art:element.cumplimientos_obligacion.fundamento_legal.articulo,
              actualizado:element.cumplimientos_obligacion.fundamento_legal.actualizado_en,

              por_incumplimiento: element.aporte_semaforo.por_incumplimiento,
              reporte_en_1_dia: element.aporte_semaforo.reporte_en_1_dia,

              usuario1:element.interaccion_usuarios.responsable,
              usuario2:element.interaccion_usuarios.segundo,
              usuario3:element.interaccion_usuarios.supervisor,
              usuario4:element.interaccion_usuarios.director,
              usuario5:element.interaccion_usuarios.GB,
              
              obligacion:element.cumplimientos_obligacion.id_obligacion,
              id:element.id_cumplimiento_mensual,
            },
            backup:{
              id_cumplimiento:element.cumplimientos_obligacion.id_cumplimiento,
              color:'',

              descripcion:element.descripcion,
              nombre:element.nombre,
              fecha_cumplimiento: element.fecha_cumplimiento,
              switch:false ,

              ISR:element.cumplimientos_obligacion.impuestos.impuesto_isr,
              IVA:element.cumplimientos_obligacion.impuestos.impuesto_iva,
              NOMINA:element.cumplimientos_obligacion.impuestos.impuesto_nomina,
              OTRO:element.cumplimientos_obligacion.impuestos.impuesto_otro,

              si: element.aplica_punto.si,
              no: element.aplica_punto.no,
              prioridad: element.cumplimientos_obligacion.prioridad,

              fecha_inicio_cumplimiento: element.cumplimientos_obligacion.fecha_inicio_cumplimiento,
              fecha_cumplir:element.cumplimientos_obligacion.fecha_se_puede_cumplir,
              fecha_ideal:element.cumplimientos_obligacion.fecha_ideal,
              fecha_maxima:element.cumplimientos_obligacion.fecha_maxima,
              fecha_habilitacion: element.cumplimientos_obligacion.fecha_habilitacion,
              fecha_inicio_ideal: element.cumplimientos_obligacion.fecha_inicio_ideal,

              se_cumplio:'',
              fecha_cumplio:element.cumplimientos_obligacion.fecha_cumplimiento,

              leyes:element.correlacion.leyes,
              temario:element.correlacion.temario,
              busqueda:element.correlacion.busqueda,
              numeros:element.correlacion.numeros,
              impuestos:element.correlacion.impuestos,
              documentacion:element.correlacion.documentacion,
              
              caso_practico:element.correlacion.capacitaciones.caso_practico,
              textos:element.correlacion.capacitaciones.textos,
              preguntas_frecuentes:element.correlacion.capacitaciones.preguntas_frecuentes,
              mejores_practicas:element.correlacion.capacitaciones.mejores_practicas,
              un_minuto:element.correlacion.capacitaciones.min1,
              cinco_minutos:element.correlacion.capacitaciones.min5,
              quince_minutos:element.correlacion.capacitaciones.min15,
              treinta_minutos:element.correlacion.capacitaciones.min30,
              sesenta_minutos:element.correlacion.capacitaciones.min60,

              dictamen:element.correlacion.dictamen,
              semaforo:element.correlacion.semaforo,
              inconsistencias:element.correlacion.inconsistencias,
              
              sanciones_generales:element.correlacion.sanciones_generales_importantes,
              empresa:element.correlacion.sanciones_penales.empresa,
              persona:element.correlacion.sanciones_penales.persona,

              fundamento_legal:element.cumplimientos_obligacion.fundamento_legal,
              art:element.cumplimientos_obligacion.fundamento_legal.articulo,
              actualizado:element.cumplimientos_obligacion.fundamento_legal.actualizado_en,



              por_incumplimiento: element.aporte_semaforo.por_incumplimiento,
              reporte_en_1_dia: element.aporte_semaforo.reporte_en_1_dia,
              
              obligacion:element.cumplimientos_obligacion.id_obligacion,
              id:element.id_cumplimiento_mensual,
            }
          };

            const today = Date.now()
            if(element.cumplimientos_obligacion.completado !== true){
              row.content.se_cumplio = null
              row.backup.se_cumplio = null
              if(today >= row.content.fecha_maxima) {
                row.content.se_cumplio = 'No se cumplió'
                row.backup.se_cumplio = 'No se cumplió'
              }
            } else {
              row.content.se_cumplio = 'Se cumplió'
              row.backup.se_cumplio = 'Se cumplió'
            }
            
            /*
            row.content = new Date(row.content).toDateString(); row.backup = row.content
            if(row.content.fecha_cumplir != null)row.content.fecha_cumplir = new Date(row.content.fecha_cumplir).toDateString(); row.backup.fecha_cumplir = row.content.fecha_cumplir
            if(row.content.fecha_ideal != null)row.content.fecha_ideal = new Date(row.content.fecha_ideal).toDateString(); row.backup.fecha_ideal = row.content.fecha_ideal
            if(row.content.fecha_maxima != null)row.content.fecha_maxima = new Date(row.content.fecha_maxima).toDateString(); row.backup.fecha_maxima = row.content.fecha_maxima
            if(row.content.fecha_cumplio != null)row.content.fecha_cumplio = new Date(row.content.fecha_cumplio).toDateString(); row.backup.fecha_cumplio = row.content.fecha_cumplio
            */

            if(row.content.fecha_ideal === null){
              row.content.fecha_ideal = today
              row.backup.fecha_ideal = today
            }

            if(today > element.cumplimientos_obligacion.fecha_maxima){
              if(element.cumplimientos_obligacion.completado !== true){
                row.content.color = '#f23f3f' // rojo
              } else {
                row.content.color = '#31e32b' // verde
              }
            } else {
              if(row.content.se_cumplio === 'Se cumplió'){
                row.content.color = '#31e32b' // verde
              } else {
                row.content.color = '#e0e32b' // amarillo
              }
            }
            row.backup = row.content

            row.content.fundamento_legal.forEach(element => {
              element.fecha = new Date(element.fecha).toDateString();
            });
            row.backup.fundamento_legal = row.content.fundamento_legal

            if(row.content.prioridad === 1){
              row.content.prioridad = 'Alta';
              row.backup.prioridad = row.content.prioridad;
            } else if(row.content.prioridad === 3) {
              row.content.prioridad = 'Baja';
              row.backup.prioridad = row.content.prioridad
            } else {
              row.content.prioridad = 'Prioridad'
              row.backup.prioridad = row.content.prioridad
            }
            console.log('ROW', row)
            rows.push(row)
        })
        this.dataSource.data = rows
        console.log(this.dataSource)
      },
      error: err => {
        this.bandera = false
        console.log(this.apiService.decrypt(err.error.message, 'private'));
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
    this.dataSource.data = [];
    this.displayedColumns = [];
    this.fixedColumns = ['fixedColumn','fixedColumn2', 'fixedColumn3', 'fixedColumn4', 'fixedColumn5', 'fixedColumn6', 'fixedColumn7', 'fixedColumn8'];
    let rows = []
    for (let i = 1; i <= 1; i++) {
      const row = { 
        nombre:'',
        descripcion:'',
        fixedColumn: `${i}`,
        fixedColumn2: '',
        fixedColumn3: {
          si:'verdadero',
          no:'falso',
          prioridad:'17'
        }, 
        fixedColumn4: {
          leyes:['Codigo fiscal'],
          temario:['Impuestos fiscales'],
          busqueda:'No aplica',
          numeros:'romanos',
          impuestos:'sobre la renta',
          documentacion:['no aplica'],
          caso_practico:'Evadir impuestos',
          textos:'no aplica',
          preguntas_frecuentes:'no',
          mejores_practicas:'HA',
          un_minuto:['no'],
          cinco_minutos:['no'],
          quince_minutos:['no'],
          treinta_minutos:['si'],
          sesenta_minutos:['no'],
          dictamen:'ilegal',
          semaforo:'rojo',
          inconsistencias:'no aplica',
          sanciones_generales:'carcel eterna',
          empresa:'no',
          persona:'si'
        }, 
        fixedColumn5: {
          fecha_cumplir:'',
          fecha_ideal:'',
          fecha_maxima:'',
          fundamento_legal:[],
          art:'14',
          actualizado:'2022',
          se_cumplio:['si'],
          fecha_cumplio:''
        },
        fixedColumn6:{
          color:'red'
        },
        fixedColumn7:{
          ISR:1,
          IVA:0,
          NOMINAS:0,
          OTROS:0
        },
        switch:false ,

        nombreRec:'',
        descripcionRec:'',
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
          un_minuto:['no'],
          cinco_minutos:['no'],
          quince_minutos:['no'],
          treinta_minutos:['si'],
          sesenta_minutos:['no'],
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
          fundamento_legal:[],
          art:'14',
          actualizado:'2022',
          se_cumplio:['si'],
          fecha_cumplio:'antier'
        },
        fixedColumn6Rec:{
          color:'red'
        },
        fixedColumn7Rec:{
          ISR:1,
          IVA:0,
          NOMINAS:0,
          OTROS:0
        }
      };

      rows.push(row);
    }
    this.dataSource.data = rows
    
  }

  onSwitchChange(row: any) {
    console.log(row.switch)
    console.log(row.content)
    console.log(row.backup)
    row.switch
    if (row.switch) {
      row.fixedColumn = ''
      row.content = ''
      row.content = ''
      row.content = ''
      row.content = ''
    } else {
      row.fixedColumn = row.fixedColumnRec
      row.content = row.backup
      row.content = row.backup
      row.content = row.backup
      row.content = row.backup
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
    this.dataSource.data = [];
    this.offset += 20
    this.getObligations(this.offset)
  }

  closePanel(close: boolean){
    close ? this.isShownComponent = false : this.isShownComponent = true;
    this.isShownTopics = false
    this.isShownDocumentation = false
    this.isShownCapacitations = false
    this.getObligations()
  }

  //---------------------------------------FOR CORRELATION WITH ARTICLES--------------------------------------//

  openArticleRef(row:any){
    this.universalRow = row
    console.log(this.universalRow)
    if(this.isShownComponent == true){
      this.isShownComponent = false
    } else {
      this.isShownComponent = true
      this.extArticulos = 'temporal'
    }
  }

  openArticleFund(row:any){
    if(this.isShownComponent == true){
      this.isShownComponent = false
    } else {
      this.isShownComponent = true
      this.extArticulos = 'cumplimiento_fundamentos'
    }

    this.universalRow = row
    console.log(this.isShownComponent)
  }

  artReceived(art: any[]) {
    if(art.length === 0) {
      console.log('vacio')
      return
    }
    console.log(art)
    console.log(this.universalRow.fixedColumn)
    art.length == 0 ? this.showResults = false : this.showResults = true;
    this.listOfArticles = Object.assign(art)
    let ides = []
    art.forEach((element) => {
      ides.push(element.id)
    })
    let body = {}

    if(this.extArticulos == 'temporal'){
      body = {data:{
        arr_articulos:ides,
        id_obligacion:this.universalRow.obligacion
      }}
    } else {
      body = {data:{
        arr_articulos:ides,
        id_cumplimiento:this.universalRow.fixedColumn
      }}
    }
    
    console.log('CUERPO', body)

    this.apiService.relateCumplimientoArticulo(body, this.extArticulos).subscribe({
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

  parRecieved(par:any[]){
    console.log(par)
    console.log(this.universalRow.fixedColumn)
    let ides = []
    par.forEach((element) => {
      ides.push(element.id)
    })
    let body = {}

    if(this.extArticulos == 'temporal'){
      body = {data:{
        arr_relacion_parrafos:ides,
        id_obligacion:this.universalRow.obligacion
      }}
    } else {
      return
    }
    
    console.log('CUERPO', body)

    this.apiService.relateCumplimientoArticulo(body, this.extArticulos).subscribe({
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

  delArtRecieved(del:any[]){
    if(del.length <1){
      return
    }
    console.log('DELETED',del)
    const body = {
      id_cumplimiento:this.universalRow.fixedColumn,
      articulos: del
    }
    console.log('BODY', body)
    this.apiService.deleteCumplimientoArticulo(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        console.log('RESPONSE',res.result)
      },
      error: err => {
        err = JSON.parse(this.apiService.decrypt(err.error.message, 'private'));
        console.log('ERROR',err);
      }
    });
  }

  articleClicked(a:any){
    let data = {mode:1, content:a}
    const dialogRef = this.dialog.open(DisplayModalComponent, {
      data: data, // Pasar el objeto a la modal
    });
  }  

  //---------------------------------------FOR CORRELATION WITH TOPICS--------------------------------------//

  openTopicsRef(row:any){
    if(this.isShownTopics == true){
      this.isShownTopics = false
    } else {
      this.isShownTopics = true
    }

    this.universalRow = row
    console.log(this.isShownTopics)
  }

  topicReceived(art: any[]) {
    console.log(art)
    console.log(this.universalRow.fixedColumn)
    this.listOfArticles = Object.assign(art)
    const body = {data:{
      arr_temario:art,
      id_cumplimiento:this.universalRow.fixedColumn
    }}
    console.log('CUERPO', body)

    this.apiService.relateCumplimientoTopics(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        console.log('RESPONSE',res.result)
        this.isShownTopics = false
      },
      error: err => {
        this.bandera = false
        console.log(err);
      }
    }); 
  }

  //---------------------------------------FOR CORRELATION WITH DOCUMENTATIONS--------------------------------------//

  openDocumentationsRef(row:any){
    if(this.isShownDocumentation == true){
      this.isShownDocumentation = false
    } else {
      this.isShownDocumentation = true
    }

    this.universalRow = row
  }

  onDataReceived(data: any[]) {
    this.sentDocumentations = data
    console.log(this.sentDocumentations)
  }

  documentationReceived() {
    console.log(this.sentDocumentations)
    const body = {data:{
      arr_documentaciones:this.sentDocumentations,
      id_obligacion:this.universalRow.obligacion
    }}
    console.log('CUERPO', body)

    this.apiService.relateCumplimientoDocumentaciones(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        console.log('RESPONSE',res.result)
        this.isShownDocumentation = false
      },
      error: err => {
        this.bandera = false
        console.log(err);
      }
    }); 
  }

  closeDocumentation(){
    this.isShownDocumentation = false
  }

  //---------------------------------------FOR CORRELATION WITH CAPACITATIONS--------------------------------------//
  openCapacitationsRef(row:any){
    if(this.isShownCapacitations == true){
      this.isShownCapacitations = false
    } else {
      this.isShownCapacitations = true
    }

    this.universalRow = row
  }

  onCapacitationsReceived(data: any[]) {
    this.sentCapacitations = data
    console.log(this.sentCapacitations)
  }

  capacitationsRecieved() {
    console.log(this.sentCapacitations)
    const body = {data:{
      arr_capacitaciones:this.sentCapacitations,
      id_cumplimiento:this.universalRow.fixedColumn
    }}
    console.log('CUERPO', body)

    this.apiService.relateCumplimientoCapacitaciones(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        console.log('RESPONSE',res.result)
        this.isShownDocumentation = false
      },
      error: err => {
        this.bandera = false
        console.log(err);
      }
    }); 
  }

  closeCapacitations(){
    this.isShownCapacitations = false
  }

  modPrioridad(modo, row){
    const body = {
      data: {
        id: row.content.id,
        special:"true",
        obligacion:{
          prioridad:modo
        }
      }
    }
    this.apiService.editCumplimiento(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        if(modo === 1){
          row.content.prioridad = 'Alta'
          row.backup.prioridad = 'Alta'
        } else {
          row.content.prioridad = 'Baja'
          row.backup.prioridad = 'Baja'
        }
      },
      error: err => {
        console.log(err);
      }
    })
  }

  updateIVA(event:any, row:any){
    row.content.ISR = 0
    row.content.OTRO = 0
    row.content.NOMINA = 0
    row.contentRec = row.content
    let activo = 0
    if(event.checked){
      activo = 1
    } else {
      activo = 0
    }
    const body = {
      data: {
        id: row.content.id,
        special: "true",
        obligacion:{
          impuesto_isr:0,
          impuesto_otro:0,
          impuesto_nomina:0,
          impuesto_iva: activo
        }
      }
    }
    this.apiService.editCumplimiento(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        row.content.IVA = activo
        row.contentRec.IVA = activo
      },
      error: err => {
        console.log(err);
      }
    })
  }

  updateISR(event:any, row:any){
    row.content.OTRO = 0
    row.content.IVA = 0
    row.content.NOMINA = 0
    row.respaldo = row.content
    let activo = 0
    if(event.checked){
      activo = 1
    } else {
      activo = 0
    }
    const body = {
      data: {
        id: row.content.id,
        special: "true",
        obligacion:{
          impuesto_iva:0,
          impuesto_otro:0,
          impuesto_nomina:0,
          impuesto_isr: activo
        }
      }
    }
    this.apiService.editCumplimiento(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        row.content.ISR = activo
        row.contentRec.ISR = activo
      },
      error: err => {
        console.log(err);
      }
    })
  }

  updateNOM(event:any, row:any){
    row.content.ISR = 0
    row.content.IVA = 0
    row.content.OTRO = 0
    row.contentRec = row.content
    let activo = 0
    if(event.checked){
      activo = 1
    } else {
      activo = 0
    }
    const body = {
      data: {
        id: row.content.id,
        special: "true",
        obligacion:{
          impuesto_isr:0,
          impuesto_otro:0,
          impuesto_iva:0,
          impuesto_nomina: activo
        }
      }
    }
    this.apiService.editCumplimiento(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        row.content.NOMINA = activo
        row.contentRec.NOMINA = activo
      },
      error: err => {
        console.log(err);
      }
    })
  }

  updateOTHER(event:any, row:any){
    row.content.ISR = 0
    row.content.IVA = 0
    row.content.NOMINA = 0
    row.contentRec = row.content
    let activo = 0
    if(event.checked){
      activo = 1
    } else {
      activo = 0
    }
    const body = {
      data: {
        id: row.content.id,
        special: "true",
        obligacion:{
          impuesto_isr:0,
          impuesto_iva:0,
          impuesto_nomina:0,
          impuesto_otro: activo
        }
      }
    }
    this.apiService.editCumplimiento(body).subscribe({
      next: res => {
        res = JSON.parse(this.apiService.decrypt(res.message, 'private'));
        row.content.OTRO = activo
        row.contentRec.OTRO = activo
      },
      error: err => {
        console.log(err);
      }
    })
  }

  reorderBy(campo){
    let datos = this.dataSource.data
    if(campo === 'id_cumplimiento'){
      datos = datos.sort((a:any, b:any) => a.fixedColumn - b.fixedColumn);
      this.dataSource.data = datos
    } else if (campo === 'fecha_ideal'){
      datos = datos.sort((a:any, b:any) => a.fixedColumn5.fecha_ideal - b.fixedColumn5.fecha_ideal)
      this.dataSource.data = datos
    }
  }

  //---------------------------------------FOR MODIFICATIONS OF DATE--------------------------------------//

  onDateSelected(event: any, tipo:number, id:number) {
    const time = event.value.getTime()
    let body = {obligation:null, cumplimientoMensual:null};

    if(tipo === 1) body.obligation = {fecha_inicio_ideal:time}
    if(tipo === 2) body.obligation = {fecha_inicio_ideal_fin:time}
    if(tipo === 3) body.obligation = {fecha_inicio:(time/60000)}
    if(tipo === 4) body.obligation = {fecha_inicio_fin:time}
    if(tipo === 5) body.obligation = {periodo_fecha_ideal:time}
    if(tipo === 6) body.obligation = {fecha_ideal_fin:time}
    if(tipo === 7) body.obligation = {fecha_maxima:time}
    if(tipo === 8) body.obligation = {periodo_fecha_maxima:time}
    body.obligation.id = id

    this.apiService.editDates(body).subscribe({
      next: res => {
        console.log(res)
      }, error: err => {
        console.log(err)
      }
    })
  }
}
