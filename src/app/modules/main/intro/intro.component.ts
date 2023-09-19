import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit/*, OnChanges, AfterViewInit*/ {
  @ViewChild('video', {read:ElementRef, static:false}) video:ElementRef
  @ViewChild('divVideo',{static:false}) divVideo:ElementRef;  
  @ViewChild('scrollElement') scrollElement: ElementRef;

  messageReceived = '';

  srcVideo = "";
  titVideo = ""
  results =[];

  constructor(private apiService:ApiService, private changeDetector:ChangeDetectorRef) {moment.locale("es"); }

  ngOnInit(): void {
    this.get();    
  }

  get(){
    this.apiService.getAll(this.apiService.MODELS.intros).subscribe({
      next:(res)=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        if(res.status == "OK"){
          this.results = res.result;
          this.setSrcVideo(this.results[0])
          console.log(this.results)
          /*res.result.forEach(res => {
            res.fecha = (moment(res.fecha * 60000).format('MMMM/YYYY')).toUpperCase(); //(new Date((res.fecha * 60000))).toLocaleDateString()
          });
          this.mytimelines = res.result;
          if(this.mytimelines.length > 0) this.playNew(this.mytimelines[this.numVideo]);*/
        }
      }
    });
  }

  setSrcVideo(obj){
    //if(!this.video) this.changeDetector.detectChanges();
    this.changeDetector.detectChanges();
    if(obj.video.url == undefined){
      alert('No se encontró el video')
    }else{
      this.srcVideo = obj.video.url;
    }
    this.titVideo = obj.titulo;
    setTimeout(()=>{this.playNew(obj);},1)
    //this.playNew(obj);
  }

  handleVideoError() {
    alert('No se encontró el video')
  }

  playNew(obj:any, numVideo=-1){
    //this.mytimelines.forEach(mtl => {mtl.selected = false;});
    obj.selected=true;
    this.video.nativeElement.src = obj.video.url;
    this.video.nativeElement.muted = false;
    this.video.nativeElement.load();
    //this.noticia.nativeElement.onended = () => {console.log('ended');}
    //this.noticia.nativeElement.onended = (event) => {alert(event);}
    this.video.nativeElement.play();
    /*if(this.idIntVideo == null){
      clearInterval(this.idIntVideo); this.idIntVideo = null;
    }
    this.idIntVideo = setInterval(()=>{
      if(this.noticia.nativeElement.ended || this.noticia.nativeElement.src == 'http://localhost:4200/null'){
        console.log('ended');
        if(numVideo < 0){
          if(this.numVideo == 11) this.numVideo = 0;
          else this.numVideo++;
        }else this.numVideo = numVideo + 1;
        this.playNew(this.mytimelines[this.numVideo]);
      }
    },1000);*/
    this.divVideo.nativeElement.parentElement.parentElement.parentElement.scrollIntoView({ behavior: 'smooth' });
  }

  videoLoaded() {
    // Este método se llama cuando se ha cargado la metadata del video
    // Reproduce el video automáticamente
    this.video.nativeElement.play();
  }

  scrollDown() {
    this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

}
 