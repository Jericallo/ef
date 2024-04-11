import { Component, ElementRef, OnInit, ViewChild, LOCALE_ID } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import * as moment from 'moment';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  animations: [
    trigger('dialogAnimation', [
      state('void', style({ transform: 'translateX(-100%)' })),
      transition(':enter', animate('0.5s ease-in-out')),
      transition(':leave', animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))),
    ])
  ]
})

export class NewsComponent implements OnInit {
  @ViewChild('noticia', {static:true}) noticia:ElementRef
  @ViewChild('scrollElement') scrollElement: ElementRef;

  isLoading = false

  numVideo = 0;
  mytimelines: any[] = []; // Aquí se declara mytimelines como un arreglo vacío
  idIntVideo = null;
  videoDeInicio = 11
  public showModal:boolean = false

  constructor(private apiService:ApiService) { moment.locale("es"); }

  ngOnInit(): void {
    this.get();
    this.noticia.nativeElement.addEventListener('error', this.handleVideoError);
  }

  
  async playNew(obj: any, vieoSeleccionao = -1) {
    this.isLoading = true
    try{
      if(typeof obj === "undefined"){
        return
      }
      let url = ''
      const partes = obj.filename.split('.')
      const name = partes[0]
      const res = await this.apiService.watch(name)
      url = URL.createObjectURL(res)
      obj.address = url
  
      this.mytimelines.forEach(mtl => {mtl.selected = false;});
      obj.selected=true;
      this.noticia.nativeElement.src = obj.address;
      this.noticia.nativeElement.muted = false;
      this.noticia.nativeElement.load();
      this.noticia.nativeElement.play();
  
      if(vieoSeleccionao !== -1){
        this.videoDeInicio = vieoSeleccionao
      }
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
  }

  get(){
    this.isLoading = true
    this.apiService.getNews().subscribe({
      next:(res)=>{
        this.isLoading = false
        res.result = res.result.reverse()
        this.mytimelines = res.result;
        console.log(this.mytimelines)
        if(this.mytimelines.length > 0) this.playNew(this.mytimelines[11]);
      }, error:(err)=>{
        console.log(this.apiService.decrypt(err.error.message, 'private'))
        this.isLoading = false
      }
    });
  }

  compararPorFecha(a, b) {
    return a.fecha - b.fecha;
  }

  vidEnded(){
    if(this.videoDeInicio === 0){
      window.location.href = 'compliance/index'
    }
    this.videoDeInicio --
    this.playNew(this.mytimelines[this.videoDeInicio])
  }

  scrollDown() {
    this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleVideoError = (event) => {

    setTimeout(() => {
      this.showModal = true;
      // Ocultar la modal después de 5 segundos
      setTimeout(() => {
        this.showModal = false;
      }, 5000);
    }, 0);

    
    this.videoDeInicio--;
    this.playNew(this.mytimelines[this.videoDeInicio]);
  }

  formatDate(date:string){
    const fecha = new Date(parseInt(date))
    console.log(fecha)
    const mes = fecha.toLocaleString('default', {month:'short'})
    const anio = fecha.getFullYear().toString().slice(-2);
    return `${mes}/${anio}`
  }

  formatDateLong(date:string){
    const fecha = new Date(parseInt(date))
    console.log(fecha)
    const mes = fecha.toLocaleString('default', {month:'long'})
    const anio = fecha.getFullYear().toString().slice(-2);
    return `${mes}/${anio}`
  }

}