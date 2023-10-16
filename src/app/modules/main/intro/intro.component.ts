import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss']
})
export class IntroComponent implements OnInit/*, OnChanges, AfterViewInit*/ {
  @ViewChild('video', {read:ElementRef, static:false}) video:ElementRef
  @ViewChild('divVideo',{static:false}) divVideo:ElementRef;  
  @ViewChild('scrollElement') scrollElement: ElementRef;
  @ViewChild('scrollElement2') scrollElement2: ElementRef;



  messageReceived = '';
  countdown: number = 7;
  srcVideo = "";
  titVideo = ""
  results =[];
  showContinueWatching = false;
  nextVideoTitle: string;
  showRepeat = false


  constructor(private apiService:ApiService, private changeDetector:ChangeDetectorRef, private dialog: MatDialog, private router: Router) {moment.locale("es"); }

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

        }
      }
    });
  }

  setSrcVideo(obj){
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

  playNew(obj: any) {
    if (typeof obj === "undefined") {
      return;
    }
    this.results.forEach((mtl) => {
      mtl.selected = false;
    });
    obj.selected = true;
    this.video.nativeElement.src = obj.video.url;
    this.video.nativeElement.muted = false;
  
    this.video.nativeElement.addEventListener("loadedmetadata", () => {
      const videoDuration = this.video.nativeElement.duration;
      const alertTime = videoDuration - 7;
  
      const checkRemainingTime = () => {
        const currentTime = this.video.nativeElement.currentTime;
        if (currentTime >= alertTime) {
          this.startCountdown(); 
        }
        if (this.video.nativeElement.ended) {
          this.showContinueWatching = false;
          const currentIndex = this.results.indexOf(obj);
          if (currentIndex < this.results.length - 1) {
            const nextVideo = this.results[currentIndex + 1];
            this.playNew(nextVideo);
          } else {
            console.log("No hay más videos para reproducir.");
            this.nextVideoTitle = "";
          }
        }
      };
  
      const intervalId = setInterval(checkRemainingTime, 1000);
  
      this.video.nativeElement.play();
      this.divVideo.nativeElement.parentElement.parentElement.parentElement.scrollIntoView({
        behavior: "smooth",
      });
    });
  
    this.video.nativeElement.load();
  }
  
  startCountdown() {
    this.countdown = 7; 
    this.showContinueWatching = true;
    const currentIndex = this.results.findIndex((item) => item.selected);
  if (currentIndex < this.results.length - 1) {
    this.nextVideoTitle = this.results[currentIndex + 1].titulo;
  } else {
    this.nextVideoTitle = ""; 
  }
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(interval);
        this.showContinueWatching = false;
      }
    }, 1000);
  }
  
  

  goToCalendar() {
    this.router.navigate(['/compliance/index']);
  }

  goToManual() {
    this.scrollToManual()
  }
  
  
  closeDialog(){
    this.dialog.closeAll()
  }
  

  videoLoaded() {
    this.video.nativeElement.play();
  }

  scrollDown() {
    this.scrollElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToManual() {
    this.scrollElement2.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  showRepeatMenu()
  {
    this.showRepeat = !this.showRepeat
  }

  quince() {
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.currentTime -= 15;
    }
  }

  unMinuti() {
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.currentTime -= 60;
    }
  }
  
  desdeElPrincipio() {
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.currentTime = 0;
    }
  }  
}
 