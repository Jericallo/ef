import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questionarie',
  templateUrl: './questionarie.component.html',
  styleUrls: ['./questionarie.component.scss']
})
export class QuestionarieComponent implements OnInit {
  questionarie: any;
  questions: any[] = [];
  currentQuestionIndex: number = 0;
  answeredCount: number = 0;
  correctAnswersCount: number = 0;
  questionarieId: any
  limitedTime: any
  intervalId: any;
  startTime!: number;
  timeRemaining!: string;

  @ViewChild('form', { static: false }) form!: NgForm;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.questionarie = history.state.questionarieData.questionarie;
    console.log(this.questionarie)
    this.questionarieId = history.state.questionarieData.questionarie.id
    this.limitedTime = history.state.questionarieData.questionarie.video_registro.capacitaciones.tiempo_limite
    this.getQuestions();
    this.initTimer();
  }

  initTimer() {
    this.startTime = Date.now();
    const duration = this.limitedTime * 1000;
    let endTime = this.startTime + duration;

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const timeLeft = Math.max(0, endTime - now);
      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);

      this.timeRemaining = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      if (timeLeft === 0) {
        clearInterval(this.intervalId);
         this.onSubmit(true); 
      }
    }, 1000);
  }


  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  getQuestions() {
    if (this.questionarie && this.questionarie.pregunta_cuestionario) {
      this.questions = this.questionarie.pregunta_cuestionario.map((item: any) => ({
        id: item.id_pregunta,
        contenido: item.capacitaciones_preguntas.contenido,
        capacitations_preguntas_respuestas: item.capacitaciones_preguntas.capacitaciones_preguntas_respuestas,
        respuesta: null
      }));
    }
  }
  

  updateAnsweredCount() {
    console.log(this.questions)
    this.answeredCount = this.questions.filter(pregunta => pregunta.respuesta).length;
  }
  
  onSubmit(forceSubmit: boolean = false) {
    const now = Date.now();
    const durationInSeconds = Math.floor((now - this.startTime) / 1000);
  
    this.updateAnsweredCount();
  
    const allQuestionsAnswered = this.answeredCount === this.questions.length;
    const isTerminated = forceSubmit || allQuestionsAnswered;
  
    if (allQuestionsAnswered || forceSubmit) {
      clearInterval(this.intervalId);
      const answerIds = this.questions.map(pregunta => pregunta.respuesta);

      
      const body = {
        answers_ids: answerIds,
        terminado: isTerminated ? 1 : 0,
        duracion: durationInSeconds
      };
  
      this.apiService.grades(this.questionarieId, body).subscribe({
        next: res => {
          console.log(forceSubmit);
          Swal.fire({
            title: forceSubmit ? 'Tiempo agotado' : '¡Respuestas enviadas!',
            text: `Obtuviste una calificación de: ${res.result}`,
            icon: forceSubmit ? 'warning' : 'success'
          });
          this.router.navigate(['/capacitaciones']);
        },
        error: err => {
          Swal.fire({
            title: '¡Error enviando las respuestas!',
            text: 'Por favor, inténtelo de nuevo.',
            icon: 'error'
          });
        }
      });
    } else if (!forceSubmit) {
      Swal.fire({
        title: '¡Faltan contestar preguntas!',
        text: 'Debe contestar todas las preguntas antes de enviar.',
        icon: 'info'
      });
    }
  }
}
