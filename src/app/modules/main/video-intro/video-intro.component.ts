import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { ChangeDetectorRef } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

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

  constructor(private apiService: ApiService, private changeDetector:ChangeDetectorRef) { }

  ngOnInit(): void {
    this.get()
  }

  get(){
    this.apiService.getAll(this.apiService.MODELS.intros).subscribe({
      next:(res)=>{
        res = JSON.parse(this.apiService.decrypt(res.message,this.apiService.getPrivateKey()))
        if(res.status == "OK"){
          this.results = res.result;
          this.setSrcVideo(this.results[0])
          console.log(this.results[0])
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

  playNew(obj:any, numVideo=-1){
    //this.mytimelines.forEach(mtl => {mtl.selected = false;});
    if(typeof obj === "undefined"){
      return
    }
    this.results.forEach(mtl => {mtl.selected = false;});
    obj.selected=true;
    this.video.nativeElement.src = obj.video.url;
    this.video.nativeElement.muted = false;
    this.video.nativeElement.load();
    this.video.nativeElement.play();
    this.divVideo.nativeElement.parentElement.parentElement.parentElement.scrollIntoView({ behavior: 'smooth' });
  }

  videoLoaded() {
    this.video.nativeElement.play();
  }

}
