import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {
  @ViewChild('noticia', {static:true}) noticia:ElementRef
  @ViewChild('scrollElement') scrollElement: ElementRef;

 // noticia = "https://api.escudofiscal.alphadev.io/media/videos/1673907848066.mp4";
  numVideo = 0;
  // Timeline
  mytimelines: any[] = []; // Aquí se declara mytimelines como un arreglo vacío

  constructor(private apiService:ApiService) { moment.locale("es"); }

  ngOnInit(): void {
  
    this.get();
    console.log(this.mytimelines)
  }

  idIntVideo = null;
  playNew(obj: any, numVideo = -1) {
    console.log(obj)
    console.log(this.mytimelines)
    if (typeof obj === "undefined") {
      return;
    }
    this.mytimelines.forEach(mtl => { mtl.selected = false; });
    obj.selected = true;
    this.noticia.nativeElement.src = obj.video.url;
    this.noticia.nativeElement.muted = false;
    this.noticia.nativeElement.load();
    this.noticia.nativeElement.play();
    
    // Obtén el índice inverso del video actual
    const reverseIndex = this.mytimelines.length - 1 - this.mytimelines.indexOf(obj);
    
    if (this.idIntVideo == null) {
      clearInterval(this.idIntVideo);
      this.idIntVideo = null;
    }
    
    this.idIntVideo = setInterval(() => {
      if (this.noticia.nativeElement.ended || this.noticia.nativeElement.src == 'http://localhost:4200/null') {
        console.log('ended');
        numVideo = -1
        if (numVideo < 0) {
          if (this.mytimelines.indexOf(obj) === 0) {
            // Redireccionar a otra página cuando se reproduzcan todos los videos
            window.location.href = 'compliance/index';
          } else {
            this.playNew(this.mytimelines[this.mytimelines.indexOf(obj) - 1]);
          }
        } else {
          this.playNew(this.mytimelines[this.mytimelines.length - 1 - numVideo - 1]);
        }
      }
    }, 1000);
  }
  

  get(){
    this.apiService.getAll(this.apiService.MODELS.news).subscribe({
      next:(res)=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        if(res.status == "OK"){
          res.result.sort(this.compararPorFecha)
          res.result.forEach(res => {
            res.fecha = (moment(res.fecha * 60000).format('MMMM/YYYY')).toUpperCase();
          });
          this.mytimelines = res.result;
          if(this.mytimelines.length > 0) this.playNew(this.mytimelines[11]);
        }
      }
    });
  }

  compararPorFecha(a, b) {
    return a.fecha - b.fecha;
  }

  vidEnded(){
    console.log('ended');
  }

  scrollDown() {
    this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

}
