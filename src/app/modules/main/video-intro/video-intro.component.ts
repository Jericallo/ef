import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router

@Component({
  selector: 'app-video-intro',
  templateUrl: './video-intro.component.html',
  styleUrls: ['./video-intro.component.scss']
})
export class VideoIntroComponent implements OnInit {
  @ViewChild('video', {read:ElementRef, static:false}) video:ElementRef
  @ViewChild('divVideo',{static:false}) divVideo:ElementRef;  

  srcVideo = "";
  titVideo = ""
  results =[];
  videoCount:number = 0
  counter = 0
  private playCount = 0;
  private maxPlays = 5; 

  isLoading = false


  constructor(
    private apiService: ApiService, 
    private changeDetector: ChangeDetectorRef,
    private router: Router 
  ) { }

  ngOnInit(): void {
    this.get()
  }

  ngOnDestroy(): void {
    this.video.nativeElement.removeEventListener('ended', this.handleVideoEnded);
  }
  
  get(){
    this.isLoading = true
    this.apiService.getVideos('promotional').subscribe({
      next:(res)=>{
        this.isLoading = false
        this.results = res.result;
        this.videoCount = this.results.length
        console.log(this.results)
        this.setSrcVideo(this.results[0])
      }
    });
    this.isLoading = false
  }

  setSrcVideo(obj){
    this.changeDetector.detectChanges();
    if(obj.address == undefined){
      alert('No se encontró el video')
    }else{
      this.srcVideo = obj.address;
    }
    this.titVideo = obj.nombre;
    setTimeout(()=>{this.playNew(obj);},1)
  }

  playNew(obj: any, numVideo = -1) {
    if (this.playCount < this.maxPlays) {
      this.playCount++;
      this.results.forEach(mtl => (mtl.selected = false));
      obj.selected = true;
      this.video.nativeElement.src = obj.address;
      this.video.nativeElement.muted = false;
      this.video.nativeElement.load();
      this.video.nativeElement.play();
      this.video.nativeElement.addEventListener('ended', this.handleVideoEnded);
    } else {
      this.router.navigate(['/main/news'])    
    }
  }

  private handleVideoEnded = () => {
    this.video.nativeElement.removeEventListener('ended', this.handleVideoEnded);
    this.counter ++
    if(this.counter === this.videoCount) {
      this.router.navigate(['/main/news'])   
    } else {
      this.playNew(this.results[this.counter]);
    }
    
  };


  videoLoaded() {
    this.video.nativeElement.play();
  }
}
