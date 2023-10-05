import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { CountdownModalComponent } from './countdown-modal/countdown-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  @ViewChild('scrollElement2') scrollElement2: ElementRef;



  messageReceived = '';

  srcVideo = "";
  titVideo = ""
  results =[];

  constructor(private apiService:ApiService, private changeDetector:ChangeDetectorRef, private dialog: MatDialog) {moment.locale("es"); }

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

  playNew(obj: any, numVideo = -1) {
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
  
      this.video.nativeElement.play();
  
      const checkRemainingTime = () => {
        const currentTime = this.video.nativeElement.currentTime;
        if (currentTime >= alertTime) {
          this.openCountdownModal();
          clearInterval(intervalId);
          
          setTimeout(() => {
            this.closeDialog();
          }, 7000); 
        }
        if (this.video.nativeElement.ended) {
          clearInterval(intervalId);
          
        }
      };
  
      const intervalId = setInterval(checkRemainingTime, 1000);
  
      this.divVideo.nativeElement.parentElement.parentElement.parentElement.scrollIntoView({
        behavior: "smooth",
      });
    });
  
    this.video.nativeElement.load();
  }

  openCountdownModal() {
    const dialogRef = this.dialog.open(CountdownModalComponent, {
      width: '700px', 
      data: {
        scrollToBottom: () => {
          this.scrollElement2.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
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

}
 