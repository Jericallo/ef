import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import Swal from 'sweetalert2';

interface Answer {
  id: string;
  answer: string;
  userId: string;
}

interface Question {
  id: string;
  question: string;
  answers: Answer[];
  answer?: string;
}

interface AnswerPayload {
  questionId: string;
  answer: string;
}

@Component({
  selector: 'app-questionnaire-modal',
  templateUrl: './questionnaire-modal.component.html',
  styleUrls: ['./questionnaire-modal.component.scss']
})
export class QuestionnaireModalComponent implements OnInit {

  questions: Question[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { month: number, year: number },
    private apiService: ApiService,
    private dialogRef: MatDialogRef<QuestionnaireModalComponent> 
  ) {}

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions() {
    this.apiService.getMonthlyQuestionsToAnswer(this.data.month - 1).subscribe({
      next: (res: Question[]) => {
        this.questions = res.map((q) => {
          const userAnswer = q.answers?.[0]?.answer;
          return {
            ...q,
            answer: userAnswer === 'yes' || userAnswer === 'no' ? userAnswer : undefined,
          };
        });
      },
      error: (err) => {
        console.error('Error fetching questions:', err);
      }
    });
  }

  selectAnswer(index: number, answer: string) {
    this.questions[index].answer = answer;
  }

  submitAnswers() {
    const answersPayload: AnswerPayload[] = this.questions
      .filter((q) => q.answer)
      .map((q) => ({
        questionId: q.id,
        answer: q.answer as string,
      }));

    const payload = {
      answers: answersPayload,
      month: (this.data.month - 1).toString()
    };

    console.log(payload)

    this.apiService.submitMonthlyAnswers(payload).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Respuestas enviadas',
          text: 'Las respuestas se enviaron correctamente.',
          icon: 'success',
        });
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error enviando respuestas:', err);
      }
    });
  }


  closeDialog() {
    this.dialogRef.close(); 
  }

}
