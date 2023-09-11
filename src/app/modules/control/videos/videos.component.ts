import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { VgApiService } from '@videogular/ngx-videogular/core';
import { Subscription } from 'rxjs';
import { Capacitations } from 'src/app/shared/interfaces/capacitations-interface';
import { ApiService } from 'src/app/shared/services/api.service';
import { CapacitationsComponent } from '../capacitations/capacitations.component';
import { VideoResumeInterface } from 'src/app/shared/interfaces/video-resume-interface';

@Component({
  selector: 'ended-video-template',
  templateUrl: './ended-video-template.html',
  styleUrls: ['./ended-video-template.css']
})
export class EndedVideoComponent implements OnInit {
  counter: number = 10;
  constructor(public dialogRef: MatDialogRef<EndedVideoComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.goToCounter();
  }

  goToCounter(){
    setTimeout(() => {
      this.counter -= 1;
      this.counter > 0 ? this.goToCounter() : this.goToQuest();
    }, 1000);
  }

  repeatVideo() {
    this.dialogRef.close("repeatVideo");
  }

  goToQuest() {
    this.dialogRef.close("goToQuestions");
  }
}

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  api: VgApiService = new VgApiService;
  video: string | undefined;
  state: Capacitations | undefined;
  subscription: Subscription | undefined;
  idCapacitation: number = 0;
  timer: any;
  title:String = "";

  constructor(private _router: Router, public capComponent: CapacitationsComponent, public dialog: MatDialog, 
      public apiService: ApiService) {

    if(!sessionStorage['state']){
      const navigation = this._router.getCurrentNavigation();
      this.state = navigation ? navigation.extras.state as Capacitations : undefined;
      sessionStorage.setItem('state', JSON.stringify(this.state));  
    }

    if(sessionStorage.getItem('state')){
      const stateVideo = JSON.parse(sessionStorage.getItem('state') || '{}');
      stateVideo.url = stateVideo.url.replace('media/videos','streaming')

      this.video = stateVideo.url;
      this.idCapacitation = stateVideo.id;
      this.title = stateVideo.nivel_1 + (stateVideo.nivel_2 > 0 ? "." + stateVideo.nivel_2 : "") + 
            (stateVideo.nivel_3 > 0 ? "." + stateVideo.nivel_3 : "") + " " + stateVideo.titulo;
    } else {
      this._router.navigate(['capacitaciones']);
    }
    
  }

  ngOnInit() {
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;

    this.setStartVideo();
    this.apiService.encrypt('','')
    const videoData: VideoResumeInterface = {
      special: 'true',
      id_capacitacion: this.idCapacitation,
      id_usuario: this.apiService.id,
      segundo: 0,
    };

    this.api.getDefaultMedia().subscriptions.play
    .subscribe(() => {
        videoData.segundo = Math.round(this.api.currentTime);
        this.sendVideoSeconds(true, videoData);
    });

    this.api.getDefaultMedia().subscriptions.pause
    .subscribe(() => {
      this.sendVideoSeconds(false, videoData);
    });

    this.api.getDefaultMedia().subscriptions.ended
    .subscribe(() => {
      /* Show Modal */
      const dialogRef = this.dialog.open(EndedVideoComponent);
      /* Datos que regresan del Dialog */
      dialogRef.afterClosed().subscribe(result => {
        if(result == 'goToQuestions') {
          this.goToQuestions();
        } else {
          this.api.seekTime(0);
          this.api.getDefaultMedia().play();
        }
      });
    });
  }

  setStartVideo() {
    if(this.state?.restart) {
      this.api.seekTime(0);
    } else {
      if(this.state?.resumen_video === this.state?.duracion_video){
        this.api.seekTime(0);
      } else {
        const time = this.state?.resumen_video;
        this.api.seekTime(time ? time : 0);
      }
    }
  }

  sendVideoSeconds(event: boolean, data: VideoResumeInterface) {
    if(event) {
      console.log('GOINT TO SUBSCRIBE')
      this.subscription = this.apiService.saveVideoSecond(data)
        .subscribe({
          next: response => {
            response = this.apiService.decrypt(response,'private')
            this.timer = setTimeout(() => {
              console.log('Respuesta:',response);
             //unsubscribe
              this.subscription?.unsubscribe();
              data.segundo = Math.round(this.api.currentTime);
              this.sendVideoSeconds(true, data);
            }, 1000);
          },
          error: err => {
            console.log(err);
          }
        })
    } else {
      console.log('Going to unsubcribe');
      this.subscription ? this.subscription.unsubscribe() : undefined;
      clearTimeout(this.timer);
    }
  }

  goBack() {
    this._router.navigate(['control/capacitaciones']);
  }

  goToQuestions() {
    const navigationExtras: NavigationExtras = { state: this.state }
    this._router.navigate(['control/capacitaciones'], navigationExtras);
  }

  prevCapacitation() {
    this._router.navigate(['control/capacitaciones']);
    this.capComponent.prevCapacitation(this.state ? this.state : undefined as any);
  }

  nextCapacitation() {
    this._router.navigate(['control/capacitaciones']);
    this.capComponent.nextCapacitation(this.state ? this.state : undefined as any);
  }

  ngOnDestroy() {
    console.log("Destroy");
    clearTimeout(this.timer);
    this.subscription?.unsubscribe();
  }

}
