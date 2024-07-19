import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';
import { start } from 'repl';
import { last } from 'rxjs';

@Component({
  selector: 'app-capacitations',
  templateUrl: './capacitations.component.html',
  styleUrls: ['./capacitations.component.css']
})
export class CapacitationsComponent implements OnInit {
  loading: boolean = false;
  selectedTraining: any;
  trainings: any;
  videoName: string = '';
  id_started: any = null;
  completado: any = null
  user: any = null;
  videoProgressInterval: any;
  videoElement: HTMLVideoElement | null = null;
  finished: any = null;
  
  constructor(private apiService: ApiService, private router: Router) {
    const token = localStorage.getItem('token_escudo');
    this.user = token ? JSON.parse(token) : null;
    console.log(this.finished)
  }

  ngOnInit(): void {
    this.getTrainings();
  }

  getTrainings() {
    this.loading = true;
    this.apiService.getTrainings(this.user.id).subscribe(
      (data) => {
        this.trainings = data.allCapacitations;
        this.loading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  getLastAttempt(training: any) {
    if (training.video_registro && training.video_registro.length > 0) {
      const lastVideoRegistro = training.video_registro[training.video_registro.length - 1];
      if (lastVideoRegistro.intento_cuestionario && lastVideoRegistro.intento_cuestionario.length > 0) {
        const lastAttempt = lastVideoRegistro.intento_cuestionario[lastVideoRegistro.intento_cuestionario.length - 1];
        this.finished = lastVideoRegistro.intento_cuestionario[lastVideoRegistro.intento_cuestionario.length - 1];
        lastAttempt.calificacionNumerica = parseInt(lastAttempt.calificacion);
        lastAttempt.verde = 0
        lastAttempt.amarillo = 0
        lastAttempt.rojo = 0
        if (lastAttempt.calificacionNumerica >= 9) {
          lastAttempt.verde = 1
        } else if (lastAttempt.calificacionNumerica <= 8 && lastAttempt.calificacionNumerica >= 6) {
          lastAttempt.amarillo = 1;
        } else {
          lastAttempt.rojo = 1;
        }
        return lastAttempt
      }
    }
    return null;
  }



  getImageUrl(imageName: string): string {
    return `https://apief.globalbusiness.com.mx/uploads/${imageName}`;
  }

  showVideo(training: any): void {
    this.completado = 0
    this.selectedTraining = training;
    this.videoName = this.selectedTraining.videos.nombre;
    const data = {
      id_user: this.user.id,
      id_capacitacion: training.id
    };

    this.apiService.getVideoLocation(this.user.id, training.id).subscribe({
      next: res => {
        if (res.videoPosition !== null) {
          if (res.videoPosition.completado === 1) {
            this.completado = 1
          }
        }
        this.videoElement = document.getElementById('videoElement') as HTMLVideoElement;
        if (this.videoElement) {
          this.videoElement.src = `https://apief.globalbusiness.com.mx/uploads/${training.videos.filename}`;
          if (res.videPosition !== null) {
            this.videoElement.currentTime = res.videoPosition ? res.videoPosition.segundo : 0;
          }
          this.videoElement.play();
          const videoPlayer = document.getElementById('videoPlayer');
          if (videoPlayer) {
            videoPlayer.style.display = 'block';
          }
          if (this.videoProgressInterval) {
            clearInterval(this.videoProgressInterval);
          }
          this.videoProgressInterval = setInterval(() => this.saveProgress(), 1000);
          this.apiService.startCapacitation(data).subscribe({
            next: res => {
              this.id_started = res.followedVideo.id;
            },
            error: err => {
              console.error('Error starting capacitacion:', err);
            }
          });
        }
      },
      error: err => {
        console.error('Failed to get video location:', err);
      }


    });


  }

  saveProgress(): void {
    if (this.videoElement && this.id_started) {
      const currentTime = Math.round(this.videoElement.currentTime);
      const duration = Math.round(this.videoElement.duration);
      const body = {
        id_video_registro: this.id_started,
        segundo: currentTime,
        completado: currentTime === duration ? 1 : 0
      };

      this.apiService.registerVideoAdvancement(body).subscribe({
        next: res => {

        },
        error: err => Swal.fire('¡Error al guardar el avance!', '', 'error')
      });
    }
  }


  goToQuestionarie(): void {
    const body = {
      id_video_registro: this.id_started
    }
    this.apiService.startQuestionarie(body).subscribe({
      next: res => {
        this.router.navigate(['/control/questionarie'], { state: { training: this.selectedTraining, questionarieData: res } });
      },
      error: err => {
        console.log(err.error.message )
        if(err.error.message === "User has spent all three attempts on this quiz"){
          Swal.fire('Sin intentos!', 'Ya se tomaron los tres intentos para el cuestionario.', 'error');
        }else{
          Swal.fire('¡Error al iniciar el cuestionario!', '', 'error');
        }
      }
    });
  }

}
