import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AnimationBuilder, animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss'],
  
})
export class IntroComponent implements OnInit/*, OnChanges, AfterViewInit*/, OnDestroy {
  @ViewChild('video', {read:ElementRef, static:false}) video:ElementRef
  @ViewChild('divVideo',{static:false}) divVideo:ElementRef;  
  @ViewChild('scrollElement') scrollElement: ElementRef;
  @ViewChild('scrollElement2') scrollElement2: ElementRef;
  @ViewChild('divElement') divElement: ElementRef;

  isIntervalActive: boolean = false; 
  messageReceived = '';
  countdown: number = 7;
  srcVideo = "";
  titVideo = ""
  results =[];
  showContinueWatching = false;
  nextVideoTitle: string;
  showRepeat = false
  videoIndex = 0
  showModal:boolean = false

  isLoading = false
  private destroyed = false;

  constructor(private apiService:ApiService,
    private changeDetector:ChangeDetectorRef,
    private dialog: MatDialog, private router: Router,
    private animationBuilder: AnimationBuilder) {moment.locale("es"); }

  ngOnInit(): void {
    this.get();    
  }

  ngOnDestroy(): void {
    this.destroyed = true;
  }

  get(){
    this.isLoading = true
    this.apiService.getVideos('intro').subscribe({
      next:(res)=>{
        this.isLoading = false
        this.results = res.result;
        console.log(res.result)
        this.setSrcVideo(this.results[this.videoIndex])
        console.log(this.results)
      }
    });
    this.isLoading = false
  }

  setSrcVideo(obj){
    this.changeDetector.detectChanges();
    if(obj.address == undefined){
      alert('No se encontró el video')
    }else{
      this.videoIndex = this.results.indexOf(obj);
      this.srcVideo = obj.address;
    }
    this.titVideo = obj.titulo;
    setTimeout(()=>{this.playNew(obj);},1)
    //this.playNew(obj);
  }

  handleVideoError() {
    alert('No se encontró el video')

  }

  async playNew(obj: any) {
    this.isLoading = true
    try{
      if (typeof obj === "undefined") {
        return;
      }
      let url = ''
      const partes = obj.filename.split('.')
      const name = partes[0]
      if(!this.destroyed){
        const res = await this.apiService.watch(name)
        if(this.destroyed) return
        url = URL.createObjectURL(res)
        obj.address = url
    
        this.results.forEach((mtl) => {
          mtl.selected = false;
        });
        obj.selected = true;
        this.video.nativeElement.src = obj.address;
        this.video.nativeElement.muted = false;
    
        this.video.nativeElement.addEventListener("loadedmetadata", () => {
          const videoDuration = this.video.nativeElement.duration;
          const alertTime = videoDuration - 8;
    
          if (!this.isIntervalActive) { // Comprobar si el intervalo está activo
            this.isIntervalActive = true; // Marcar el intervalo como activo
    
            const intervalId = setInterval(() => {
              const currentTime = this.video.nativeElement.currentTime;
              if (currentTime >= alertTime) {
                clearInterval(intervalId);
                this.isIntervalActive = false; // Marcar el intervalo como inactivo
                this.startCountdown();
              }
              if (this.video.nativeElement.ended) {
    
              }
            }, 1000);
          }
    
          this.video.nativeElement.play();
          this.divVideo.nativeElement.parentElement.parentElement.parentElement.scrollIntoView({
            behavior: "smooth",
          });
        });
    
        this.video.nativeElement.load();
      }
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
    }
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
      if (this.countdown < 0) {
        clearInterval(interval);
        this.showContinueWatching = false;
      }
    }, 1000);
  }
  
  videoEnded() {
    this.showContinueWatching = false;
    const currentIndex = this.results.indexOf(this.results[this.videoIndex]);
    if (currentIndex < this.results.length - 1) {
      const nextVideo = this.results[currentIndex + 1];
      this.videoIndex++
      this.playNew(nextVideo);
    } else {
      console.log("No hay más videos para reproducir.");
      this.nextVideoTitle = "";
    }
  }

  videoClicked(obj: any) {
    this.videoIndex = this.results.indexOf(obj)
    this.playNew(obj)
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

  showRepeatMenu() {
    if (this.showRepeat) {
      const factory = this.animationBuilder.build([
        animate('200ms', style({ width: '80px', height: '60px' })),
      ]);
      const player = factory.create(this.divElement.nativeElement);
  
      player.play();
    } else {
      const factory = this.animationBuilder.build([
        animate('200ms', style({ width: '550px', height: '75px' })),
      ]);
      const player = factory.create(this.divElement.nativeElement);
  
      player.play();
    }
    
    this.showRepeat = !this.showRepeat;
  }
  

  quince() {
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.currentTime -= 15;
      this.showContinueWatching = false
    }
  }

  unMinuti() {
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.currentTime -= 60;
      this.showContinueWatching = false
    }
  }
  
  desdeElPrincipio() {
    if (this.video && this.video.nativeElement) {
      this.video.nativeElement.currentTime = 0;
      this.showContinueWatching = false
    }
  }  
}
 