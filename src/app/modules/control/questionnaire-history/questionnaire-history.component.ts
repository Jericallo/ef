import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-questionnaire-history',
  templateUrl: './questionnaire-history.component.html',
  styleUrls: ['./questionnaire-history.component.scss']
})
export class QuestionnaireHistoryComponent implements OnInit {

  months = [
    { value: 0, viewValue: 'Enero' },
    { value: 1, viewValue: 'Febrero' },
    { value: 2, viewValue: 'Marzo' },
    { value: 3, viewValue: 'Abril' },
    { value: 4, viewValue: 'Mayo' },
    { value: 5, viewValue: 'Junio' },
    { value: 6, viewValue: 'Julio' },
    { value: 7, viewValue: 'Agosto' },
    { value: 8, viewValue: 'Septiembre' },
    { value: 9, viewValue: 'Octubre' },
    { value: 10, viewValue: 'Noviembre' },
    { value: 11, viewValue: 'Diciembre' },
  ];

  years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  selectedMonth: number = new Date().getMonth();
  selectedYear: number | null = new Date().getFullYear();

  displayedColumns: string[] = ['question', 'answers'];
  dataSource: { question: string; answers: { answer: string; userId: string }[] }[] = [];


  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions(): void {
    this.apiService.getMonthlyQuestionsToAnswer(this.selectedMonth).subscribe({
      next: (res: any) => {
        this.dataSource = res.map((q: any) => ({
          question: q.question,
          answers: q.answers.map((a: any) => ({
            answer: a.answer,
            userId: a.userId,
          })),
        }));
      },
      error: (err) => {
        console.error('Error fetching questions:', err);
      },
    });
  }

}
