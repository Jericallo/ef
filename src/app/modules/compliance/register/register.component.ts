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
import { V } from '@angular/cdk/keycodes';
import { EditVideoComponent } from './edit-video/edit-video.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }] 
})

export class RegisterComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  //GLOBAL VARIABLES FOR YELLOW TABLE

  dataSource = new MatTableDataSource([])
  displayedColumns: string[];
  fixedColumns: string[];
  yellowColumns: string[];
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

  //GLOBAR VARIABLES FOR BLUE TABLE

  blueTableDataSource!:any;
  videoList = []
  blueColumnsToDisplay = ['numeros', 'modulo', 'contenido', 'link', 'column1', 'column2', 'column3', 'column4', 'column5', 'column6', 'column7', 'column8', 'column9', 'column10', 'column11', 'column12', 'column13', 'column14', 'column15', 'column16', 'column17', 'column18', 'column19', 'column20', ];

  blueColumnNames = {
    numeros: 'Números',
    modulo: 'Módulo',
    contenido: 'Contenido',
    link:'Link',
    column1: 'Columna 1',
    column2: 'Columna 2',
    column3: 'Columna 3',
    column4: 'Columna 4',
    column5: 'Columna 5',
    column6: 'Columna 6',
    column7: 'Columna 7',
    column8: 'Columna 8',
    column9: 'Columna 9',
    column10: 'Columna 10',
    column11: 'Columna 11',
    column12: 'Columna 12',
    column13: 'Columna 13',
    column14: 'Columna 14',
    column15: 'Columna 15',
    column16: 'Columna 16',
    column17: 'Columna 17',
    column18: 'Columna 18',
    column19: 'Columna 19',
    column20: 'Columna 20',
  };


  //GLOBAL VARIABLES FOR PERMISSIONS TABLE

  dataSourcePermissionTable:any
  permissionsColumnsToDisplay = ['perfil', 'circulo_azul', 'intro', 'noticias', 'leyes', 'temario', 'busqueda', 'incentivos', 'numeros', 'obligacion', 'descripcion', 'impuestos', 'aplicaAlPunto', 'prioridad', 'periodoIdeal', 'periodoRecomendado', 'vencimientoProximo', 'muyUrgente', 'fechaMaxima', 'seCumplio', 'alertaDeLoOcurrido', 'comunicacion', 'documentacion', 'textos', 'casoPractico', 'preguntasFrecuentes', '1minuto', '5minutos', '15minutos', '30minutos', '60minutos', 'examen', 'diplomado', 'especialidad', 'maestria', 'ayuda', 'dictamen', 'semaforo', 'responsable1', 'responsable2', 'supervisor', 'supervisorGB', 'director', 'administrador', 'superadministrador', 'isr', 'iva', 'fiscales', 'respuestaSat', 'inconsistencias', 'multas', 'sancionesGenericas', 'facultades', 'sancionesEmpresa', 'sancionesPersona']
  allModules =[]

  constructor(private apiService:ApiService, public dialog: MatDialog, public snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.create_table()
    this.getObligations()
    this.getProfiles()
    this.getModules()
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
        
        let rows = []
        res.tasks.forEach((element) => {
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

              leyes:element.obligations.obligations_articles,
              parrafos:element.obligations.obligations_paragraphs,
              temas:element.obligations.obligations_subjects
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
        this.getVideos()
      },
      error: err => {
        this.bandera = false
        console.log(this.apiService.decrypt(err.error.message, 'private'));
      }
    });

  }

  getModules() {
    this.apiService.getModules().subscribe({
      next:res => {
        console.log(res)
        this.allModules = res
      }, error: err => {
        console.error(err)
      }
    })
  }

  getProfiles(){
    this.apiService.getProfiles().subscribe({
      next:res => {
        console.log(res)
        this.dataSourcePermissionTable = res;
      }
    })
  }

  getVideos(){
    this.apiService.getAllVideos().subscribe({
      next: res => {
        console.log(res.result)
        let videos = res.result
        videos.sort(this.compareByType)
        videos = videos.filter(video => video.category !== 'trainning')
        console.log(videos)

        const data = []
        const contadores = {promocional:0, intro:0, noticias:0}
        videos.forEach((element, index) => {
          let entrada = {numeros:index, id:element.id, modulo:'', contenido:element.nombre, link:element.address}
          switch(element.category){
            case 'promotional':
              entrada.modulo = contadores.promocional === 0 ? 'Promocional' : 'Promocional'
              contadores.promocional ++
              break
            case 'intro':
              entrada.modulo = contadores.intro === 0 ? 'Intro' : 'Intro'
              contadores.intro ++
              break
            case 'news':
              entrada.modulo = contadores.noticias === 0 ? 'Noticias' : 'Noticias'
              contadores.noticias ++
              break
            default:
              entrada.modulo = 'Sin modulo'
          }
          data.push(entrada)
        })

        let textos = []
        let cats = []
        let urls = []
        let ids = []

        data.forEach((element, index) => {
          if(index === 0) {
            textos.push('!!MODULO!!' + element.modulo)
            cats.push('')
            urls.push('')
            ids.push(-1)
            textos.push(element.contenido)
            cats.push(element.modulo)
            urls.push(element.link)
            ids.push(element.id)
          } else if(data[index].modulo !== data[index-1].modulo){
            textos.push('!!MODULO!!' + element.modulo)
            cats.push('')
            urls.push('')
            ids.push(-1)
            textos.push(element.contenido)
            cats.push(element.modulo)
            urls.push(element.link)
            ids.push(element.id)
          } else {
            textos.push(element.contenido)
            cats.push(element.modulo)
            urls.push(element.link)
            ids.push(element.id)
          }
        })
        this.dataSource.data.forEach((element, index) => {
          if(index < textos.length){
            this.dataSource.data[index].content.columna_extra = textos[index]
            this.dataSource.data[index].content.circulo_azul = cats[index] === 'Promocional' ? urls[index] : ''
            this.dataSource.data[index].content.news = cats[index] === 'Noticias' ? urls[index] : ''
            this.dataSource.data[index].content.intro = cats[index] === 'Intro' ? urls[index] : ''
            this.dataSource.data[index].content.video_id_blue = ids[index]
          } else {
            this.dataSource.data[index].content.columna_extra = ''
            this.dataSource.data[index].content.circulo_azul = ''
            this.dataSource.data[index].content.news = ''
            this.dataSource.data[index].content.intro = ''
            this.dataSource.data[index].content.video_id_blue = ids[index]
          }
        });
        console.log(this.dataSource.data)

        this.blueTableDataSource = data
        
      }, error: err => {
        console.error(err)
      }
    })
  }

  shave(input:string){
    if(input.includes('!!MODULO!!')) return true
    else return false
  }

  shaveAgain(input:string) {
    return input.slice(10, input.length)
  }

  compareByType(a:any, b:any) {
    const orderVideos = ['promotional','intro', 'news']
    const indexA = orderVideos.indexOf(a.category)
    const indexB = orderVideos.indexOf(b.category)

    if (indexA < indexB) {
      return -1; // a viene antes que b
    } else if (indexA > indexB) {
      return 1; // b viene antes que a
    } else {
      return 0; // a y b tienen el mismo índice, están en la misma posición en el orden
    }
  }

  abrirVideo(link:string){
    window.open(link, '_blank');
  }

  editVideo(id:number){
    const dialogRef = this.dialog.open(EditVideoComponent, {
      width: '600px',
      data: { id }
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getVideos()
    });
  }

  ngAfterViewInit() {
  }

  create_table(){
    this.dataSource.data = [];
    this.displayedColumns = [];
    this.fixedColumns = ['fixedColumn02','fixedColumn01','fixedColumn2', 'fixedColumn3', 'fixedColumn4', 'fixedColumn9','fixedColumn5', 'fixedColumn7'];
    this.yellowColumns = ['fixedColumn', 'fixedColumn2']
    //'fixedColumn',
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
    art.length == 0 ? this.showResults = false : this.showResults = true;
    this.listOfArticles = Object.assign(art)
    let ides = []
    art.forEach((element) => {
      ides.push(element.id)
    })
    let body = {}

    if(this.extArticulos == 'temporal'){
      body = {
        articles_ids:ides,
        id_obligation:this.universalRow.content.id_obligacion
      }
    } else {
      body = {
        articles_ids:ides,
        id_obligation:this.universalRow.content.id_obligacion
      }
    }
    this.apiService.relateCumplimientoArticulo(body).subscribe({
      next: res => {
        console.log('RESPONSE',res)
      },
      error: err => {
        this.bandera = false
        console.log(err);
      }
    });
  }

  parRecieved(par:any[]){
    let ides = []
    par.forEach((element) => {
      ides.push(element.id)
    })
    let body = {}

    if(this.extArticulos == 'temporal'){
      body = {
        paragraphs_ids:ides,
        id_obligation:this.universalRow.content.id_obligacion
      }
    } else {
      return
    }
    console.log(body)
    this.apiService.relateCumplimientoParrafo(body).subscribe({
      next: res => {
        console.log('RESPONSE',res)
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
      id_obligation:this.universalRow.content.id_obligacion,
      articles_ids: del
    }
    console.log('BODY', body)
    this.apiService.deleteCumplimientoArticulo(body).subscribe({
      next:res => {
        console.log(res)
      }, error:err => {
        console.log(err)
      }
    })
  }

  delParRecieved(del:any[]){
    if(del.length <1){
      return
    }
    console.log('DELETED',del)
    const body = {
      id_obligation:this.universalRow.content.id_obligacion,
      paragraphs_ids: del
    }
    console.log('BODY', body)
    this.apiService.deleteCumplimientoParrafo(body).subscribe({
      next:res => {
        console.log(res)
      }, error:err => {
        console.log(err)
      }
    })
  }

  articleClicked(a:any){
    let data = {mode:1, content:a}
    const dialogRef = this.dialog.open(DisplayModalComponent, {
      data: data, // Pasar el objeto a la modal
    });
  }  

  //---------------------------------------FOR CORRELATION WITH TOPICS--------------------------------------//

  openTopicsRef(row:any){
    this.universalRow = row
    if(this.isShownTopics == true){
      this.isShownTopics = false
    } else {
      this.isShownTopics = true
    }

    
    console.log(this.isShownTopics)
  }

  topicReceived(art: any[]) {
    console.log(art)
    console.log(this.universalRow.content.id_obligacion)
    this.listOfArticles = Object.assign(art)
    const body = {
      subject_ids:art,
      id_obligation:this.universalRow.content.id_obligacion
    }
    console.log('CUERPO', body)

    this.apiService.relateCumplimientoTopics(body).subscribe({
      next: res => {
        console.log('RESPONSE',res)
        this.isShownTopics = false
      },
      error: err => {
        this.bandera = false
        console.log(err);
      }
    }); 
  }

  deleteTopic(top:any){
    console.log(top)
    const body = {
      id_obligation:this.universalRow.content.id_obligacion,
      subject_ids:[top]
    }
    this.apiService.deleteCumplimientoTopics(body).subscribe({
      next: res => {
        console.log('RESPONSE',res)
      },
      error: err => {
        console.log(err);
      }
    })
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

  //---------------------------------------FOR MODIFICATIONS OF PERMISSIONS------------------------------//

  editPermissions(permission:number, profileId:number, remove:boolean){
    if(!remove){
      const body = {
        id_profile: profileId,
        id_module: permission,
        permissions: 'R-W-E'
      }
      this.apiService.addProfileModulos(body).subscribe({
        next: res => {
          console.log(res)
          const index = this.allModules.findIndex((element) => element.id === permission)
          const profileIndex = this.dataSourcePermissionTable.findIndex((element) => element.id === profileId)
          const newModule = {
            estatus:1,
            fecha_creacion: res.new_module_profile.fecha_creacion,
            fecha_modificacion:null,
            id:res.new_module_profile.id,
            id_modulo: permission,
            id_perfil:profileId,
            modulos:this.allModules[index]
          }
          console.log(this.dataSourcePermissionTable[profileIndex])
          this.dataSourcePermissionTable[profileIndex].perfiles_modulos.push(newModule)
        }, error: err => {
          console.error(err)
        }
      })
    } else {
      const indexProfile = this.dataSourcePermissionTable.findIndex((element) => element.id === profileId)
      const profileIndex = this.dataSourcePermissionTable[indexProfile].perfiles_modulos.findIndex((element:any) => element.id_modulo === permission)
      const element = this.dataSourcePermissionTable[indexProfile].perfiles_modulos.find((element:any) => element.id_modulo === permission)
      const id = element.id

      const body = {
        id: id
      }

      this.apiService.deleteProfileModule(body).subscribe({
        next: res => {
          console.log(res)
          this.dataSourcePermissionTable[indexProfile].perfiles_modulos.splice(profileIndex, 1)
        }, error: err => {
          console.error
        }
      })
    }
  }

  getPermission(permission:number, profileId:number) {
    switch(permission){
      case 1:
        const index = this.dataSourcePermissionTable.findIndex((element:any) => element.id === profileId);
        const element = this.dataSourcePermissionTable[index].perfiles_modulos.find((element:any) => element.modulos.nombre === 'Inicio')
        if(element) return 'Si'
        else return 'No'
      case 2:
        const index2 = this.dataSourcePermissionTable.findIndex((element:any) => element.id === profileId);
        const element2 = this.dataSourcePermissionTable[index2].perfiles_modulos.find((element:any) => element.modulos.nombre === 'Intro')
        if(element2) return 'Si'
        else return 'No'
      case 3:
        const index3 = this.dataSourcePermissionTable.findIndex((element:any) => element.id === profileId);
        const element3 = this.dataSourcePermissionTable[index3].perfiles_modulos.find((element:any) => element.modulos.nombre === 'Noticias')
        if(element3) return 'Si'
        else return 'No'
      case 4:
        const index4 = this.dataSourcePermissionTable.findIndex((element:any) => element.id === profileId);
        const element4 = this.dataSourcePermissionTable[index4].perfiles_modulos.find((element:any) => element.modulos.nombre === 'Leyes')
        if(element4) return 'Si'
        else return 'No'
      case 5:
        const index5 = this.dataSourcePermissionTable.findIndex((element:any) => element.id === profileId);
        const element5 = this.dataSourcePermissionTable[index5].perfiles_modulos.find((element:any) => element.modulos.nombre === 'Temario')
        if(element5) return 'Si'
        else return 'No'
      case 6:
        const index6 = this.dataSourcePermissionTable.findIndex((element:any) => element.id === profileId);
        const element6 = this.dataSourcePermissionTable[index6].perfiles_modulos.find((element:any) => element.modulos.nombre === 'Busqueda')
        if(element6) return 'Si'
        else return 'No'
      case 7:
        const index7 = this.dataSourcePermissionTable.findIndex((element:any) => element.id === profileId);
        const element7 = this.dataSourcePermissionTable[index7].perfiles_modulos.find((element:any) => element.modulos.nombre === 'Incentivos')
        if(element7) return 'Si'
        else return 'No'
      case 8:
        const index8 = this.dataSourcePermissionTable.findIndex((element:any) => element.id === profileId);
        const element8 = this.dataSourcePermissionTable[index8].perfiles_modulos.find((element:any) => element.modulos.nombre === 'Numeros')
        if(element8) return 'Si'
        else return 'No'
      default:
        return 'No'
      }
    return "si"
  }
}
