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
import { FormControl } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

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

  public dateControl = new FormControl(new Date(2021,9,4,5,6,7));
  public dateControlMinMax = new FormControl(new Date());
  public minDate: moment.Moment;
  public maxDate: moment.Moment;
  public disabled = false;
  showSpinners = true;
  public showSeconds = true;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public touchUi = false;
  public enableMeridian = false;
  public color: ThemePalette = 'primary';
  public hideTime = false;
  public disableMinute = false;

  public date_1 = new Date()

  verticalPosition: MatSnackBarVerticalPosition = 'top';
  config_snack = { duration: 3000,verticalPosition: this.verticalPosition}

  constructor(private apiService:ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit(): void {
    
    this.create_table()
    this.getObligations()
    this.dataSource.sort = this.sort
    }

  getObligations(offset=0) {
    this.dataSource.data = []

    let date = new Date(this.sendableDate), y = date.getFullYear(), m = date.getMonth();
    let firstDay = new Date(y, m, 1);
    let lastDay = new Date(y, m + 1, 0);


    this.apiService.getCumplimientos(firstDay.getTime(), lastDay.getTime()).subscribe({
      next: res => {
        //res = JSON.parse(this.apiService.decrypt(res.message, this.apiService.getPrivateKey()));
        this.dataSource.data = []
        let rows = []
        res.forEach((element) => {
          const row = { 
            content:{
              id_cumplimiento:element.id,
              id_obligacion: element.obligations.id,
              color:'',

              descripcion:element.obligations.descripcion,
              modificadoAl:element.obligations.modified_at,
              nombre:element.obligations.nombre,
              fecha_cumplimiento: element.fecha_cumplimiento,
              switch:false ,

              ISR:element.impuesto_isr,
              IVA:element.impuesto_iva,
              NOMINA:element.impuesto_nomina,
              OTRO:element.impuesto_otro,

              si: '',
              no: '',
              prioridad: element.prioridad,

              idel_date_start:element.ideal_date_start,
              idel_date_end:element.ideal_date_end,
              recommended_date_start:element.recommended_date_start,
              recommended_date_end:element.recommended_date_end,
              close_date_start:element.close_date_start,
              close_date_end:element.close_date_end,
              urgent_date_start:element.urgent_date_start,
              urgent_date_end:element.urgent_date_end,

              idel_date_start_date:null,
              idel_date_end_date:null,
              recommended_date_start_date:null,
              recommended_date_end_date:null,
              close_date_start_date:null,
              close_date_end_date:null,
              urgent_date_start_date:null,
              urgent_date_end_date:null,

              se_cumplio:'',
              fecha_cumplio:'',

              leyes:element.obligations.obligations_articles
            },
            backup:{
              id_cumplimiento:element.id,
              color:'',

              descripcion:element.descripcion,
              nombre:element.descripcion,
              fecha_cumplimiento: element.fecha_cumplimiento,
              switch:false ,

              ISR:element.impuesto_isr,
              IVA:element.impuesto_iva,
              NOMINA:element.impuesto_nomina,
              OTRO:element.impuesto_otro,

              si: '',
              no: '',
              prioridad: element.prioridad,

              idel_date_start:element.ideal_date_start,
              idel_date_end:element.ideal_date_end,
              recommended_date_start:element.recommended_date_start,
              recommended_date_end:element.recommended_date_end,
              close_date_start:element.close_date_start,
              close_date_end:element.close_date_end,
              urgent_date_start:element.urgent_date_start,
              urgent_date_end:element.urgent_date_end,

              se_cumplio:'',
              fecha_cumplio:'',
            }
          };


          row.backup = row.content

          row.content.idel_date_start_date = new Date(parseInt(row.content.idel_date_start))
          row.content.idel_date_end_date = new Date(parseInt(row.content.idel_date_end))
          row.content.recommended_date_start_date = new Date(parseInt(row.content.recommended_date_start))
          row.content.recommended_date_end_date = new Date(parseInt(row.content.recommended_date_end))
          row.content.close_date_start_date = new Date(parseInt(row.content.close_date_start))
          row.content.close_date_end_date = new Date(parseInt(row.content.close_date_end))
          row.content.urgent_date_start_date = new Date(parseInt(row.content.urgent_date_start))
          row.content.urgent_date_end_date = new Date(parseInt(row.content.urgent_date_end))

          if(row.content.prioridad === 1){
            row.content.prioridad = 'Alta';
            row.backup.prioridad = row.content.prioridad;
          } else if(row.content.prioridad === 3) {
            row.content.prioridad = 'Baja';
            row.backup.prioridad = row.content.prioridad
          } else {
            row.content.prioridad = 'Media'
            row.backup.prioridad = row.content.prioridad
          }
          rows.push(row)
        })
        this.universalRow = rows[0]
        this.dataSource.data = rows
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
    this.fixedColumns = ['fixedColumn','fixedColumn2', 'fixedColumn3', 'fixedColumn4', 'fixedColumn9','fixedColumn5', 'fixedColumn7'];
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

  isFechaMaxima(element: any, column:number = new Date().getTime()): string {
    if (column === 0) {
      return 'transparent';
    }
    let fechaColumna = column;
    let fechaMaxima = element.urgent_date_end;
    let fechaCumplimiento = element.fecha_completado
    let fechaMinima = element.ideal_date_start
    let fechaIdeal = element.close_date_start

    if((element.completado === 1 || element.completado === 2) && fechaCumplimiento !== null) {
      if(fechaCumplimiento === fechaColumna.toString()) return '#ffcc0c'
      if(fechaCumplimiento <= fechaColumna.toString()) return 'transparent'
    } 

    if(element.completado === 3 && fechaCumplimiento !== null) {
      if(fechaCumplimiento === fechaColumna.toString()) return 'green'
      if(fechaCumplimiento <= fechaColumna.toString()) return 'transparent'
    } 
    
    if(fechaMinima > fechaColumna.toString()) return 'transparent'

    if(fechaMaxima > fechaColumna.toString()) {
      if(fechaColumna.toString() >= (fechaIdeal)) return 'red'
      else return '#ffcc0c'
    } else if(fechaMaxima === fechaColumna.toString()) return 'red'
     else if(fechaMaxima < fechaColumna.toString()) return 'transparent'
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
    console.log(this.universalRow)
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
      id: row.content.id_cumplimiento,
      prioridad:modo
    }
    console.log(body)
    this.apiService.editDates(body).subscribe({
      next: res => {
        console.log(res)
        if(modo === 1){
          row.content.prioridad = 'Alta'
          row.backup.prioridad = 'Alta'
        } else if (modo === 2) {
          row.content.prioridad = 'Media'
          row.backup.prioridad = 'Media'
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

        id: row.content.id_cumplimiento,
        impuesto_isr:0,
        impuesto_otro:0,
        impuesto_nomina:0,
        impuesto_iva: activo
      
    }
    this.apiService.editDates(body).subscribe({
      next: res => {
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

        id: row.content.id_cumplimiento,
        impuesto_iva:0,
        impuesto_otro:0,
        impuesto_nomina:0,
        impuesto_isr: activo
      
    }
    this.apiService.editDates(body).subscribe({
      next: res => {
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

        id: row.content.id_cumplimiento,
        impuesto_isr:0,
        impuesto_otro:0,
        impuesto_iva:0,
        impuesto_nomina: activo
      
    }
    this.apiService.editDates(body).subscribe({
      next: res => {
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

        id: row.content.id_cumplimiento,
        impuesto_isr:0,
        impuesto_iva:0,
        impuesto_nomina:0,
        impuesto_otro: activo
      
    }
    this.apiService.editDates(body).subscribe({
      next: res => {
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
    let body = {};

    if(tipo === 1) body = {ideal_date_start:time}
    if(tipo === 2) body = {ideal_date_end:time}
    if(tipo === 3) body = {recommended_date_start:(time)}
    if(tipo === 4) body = {recommended_date_end:time}
    if(tipo === 5) body = {close_date_start:time}
    if(tipo === 6) body = {close_date_end:time}
    if(tipo === 7) body = {urgent_date_start:time}
    if(tipo === 8) body = {urgent_date_end:time}

    body['id'] = id

    console.log(JSON.stringify(body))

    this.apiService.editDates(body).subscribe({
      next: res => {
        console.log(res)
      }, error: err => {
        console.log(err)
      }
    })
  }

  //---------------------------------------FOR MODIFICATIONS OF DESCRIPTION------------------------------//

  onFieldEdit( event: any, row: any ) {
    const body = {
      id: row.content.id_obligacion,
      descripcion: event.target.textContent
    }
    this.apiService.putObligations(body).subscribe({
      next: res => {
        console.log(res)
      }, error: err => {
        this.snackBar.open('Ha ocurrido un error al actualizar la descripción', '', this.config_snack);
      }
    })
    console.log("BODY", body);
  }

  parseDate ( date:string ) {
    const fecha = Date.parse(date)
    const fecha2 = new Date(fecha)

    return fecha2
  }
}
