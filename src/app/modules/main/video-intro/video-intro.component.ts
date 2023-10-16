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
  private playCount = 0;
  private maxPlays = 5; 

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
    this.apiService.getAll(this.apiService.MODELS.intros).subscribe({
      next:(res)=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        if(res.status == "OK"){
          this.results = res.result;
          console.log(this.results)
          this.setSrcVideo(this.results[0])
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
  }

  playNew(obj: any, numVideo = -1) {
    if (this.playCount < this.maxPlays) {
      this.playCount++;
      this.results.forEach(mtl => (mtl.selected = false));
      obj.selected = true;
      this.video.nativeElement.src = obj.video.url;
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
    this.playNew(this.results[0]);
  };


  videoLoaded() {
    this.video.nativeElement.play();
  }
}
