import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  
  playNew(obj: any, vieoSeleccionao = -1) {
    if(typeof obj === "undefined"){
      return
    }
    this.mytimelines.forEach(mtl => {mtl.selected = false;});
    obj.selected=true;
    this.noticia.nativeElement.src = obj.video.url;
    this.noticia.nativeElement.muted = false;
    this.noticia.nativeElement.load();
    this.noticia.nativeElement.play();

    if(vieoSeleccionao !== -1){
      this.videoDeInicio = vieoSeleccionao
    }

    /*if(this.idIntVideo !== null){
      clearInterval(this.idIntVideo); this.idIntVideo = null;
    }
    console.log(numVideo)
    this.idIntVideo = setInterval(()=>{
      clearInterval(this.idIntVideo);
      console.log(numVideo)
      if(this.noticia.nativeElement.ended || this.noticia.nativeElement.src == 'http://localhost:4200/null'){
        console.log('ended');
        if(numVideo < 12){
          if(numVideo === 0) window.location.href = '/compliance/index'
          else numVideo--;
        }else numVideo = numVideo + 1;
        this.noticia.nativeElement.src = this.mytimelines[numVideo].video.url
        this.noticia.nativeElement.load()
        this.noticia.nativeElement.play()
      }
    },1000);*/
  }

  get(){
    this.apiService.getAll(this.apiService.MODELS.news,'','',12).subscribe({
      next:(res)=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        if(res.status == "OK"){
          res.result.sort(this.compararPorFecha)
          res.result.forEach(res => {
            res.fecha = (moment(res.fecha * 60000).format('MMMM/YYYY')).toUpperCase();
          });
          this.mytimelines = res.result;
          console.log(this.mytimelines)
          if(this.mytimelines.length > 0) this.playNew(this.mytimelines[11]);
        }
      }, error:(err)=>{
        console.log(this.apiService.decrypt(err.error.message, 'private'))
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

}