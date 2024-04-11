import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-crud',
  templateUrl: './question-crud.component.html',
  styleUrls: ['./question-crud.component.scss']
})
export class QuestionCrudComponent implements OnInit {

  respuestas: string[] = ['']; // Inicia con una respuesta]
  preguntas: string[] = ['']; // Inicia con una respuesta
  id:number

  constructor() { }

  ngOnInit(): void {
    console.log(history.state.id)
    this.id = history.state.id
  }

  agregarRespuesta() {
    this.respuestas.push(''); // Agrega una respuesta vacía al array
  }

  agregarPregunta() {
    this.preguntas.push(''); // Agrega una respuesta vacía al array
  }
}
