import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';

interface answerInterface {
  id?:number, respuesta:string, correcta:boolean, new:boolean, deleted:number, modified:boolean
}

interface questionInterface {
  id?:number, pregunta: string, number_question?:number, new:boolean, deleted:number, modified: boolean, respuesta?: answerInterface[]
}

@Component({
  selector: 'app-question-crud',
  templateUrl: './question-crud.component.html',
  styleUrls: ['./question-crud.component.scss']
})
export class QuestionCrudComponent implements OnInit {

  questions:questionInterface[]

  id:number

  constructor( public apiService:ApiService) { }

  ngOnInit(): void {
    console.log(history.state.id)
    this.id = history.state.id
    this.fetchQuestions()
  }

  fetchQuestions() {
    this.apiService.getQuestionAndAnswer(this.id).subscribe({
      next:res => {
        console.log(res)
        if(res.message !== 'Preguntas encontradas') return

        let preguntas = []
        res.result.map((element, index) => {
          const pregunta:questionInterface = {id:element.id, pregunta:element.contenido, new:false, deleted:element.deleted, modified:false, respuesta:[]}
          element.capacitaciones_preguntas_respuestas.map((antwort, j) => {
            const respuesta:answerInterface ={ 
              id:antwort.id, 
              respuesta:antwort.respuesta, 
              correcta: antwort.es_correcta === 1 ? true : false, 
              new:false, 
              deleted:antwort.deleted, 
              modified:false}

            pregunta.respuesta.push(respuesta)
          })
          preguntas.push(pregunta)
        })
        console.log(preguntas)

        this.questions = preguntas
      }, error:err => {
        console.error(err)
      }
    })
  }

  agregarRespuesta(index) {
    const respuestaVacia = {id:null, respuesta:'', correcta:false, new:true, deleted:0, modified:false}
    this.questions[index].respuesta.push(respuestaVacia); // Agrega una respuesta vacía al array

    this.questions[index].modified = true
  }

  agregarPregunta() {
    const emptyQuestion = {id: null, pregunta:'', respuesta:[{id:null, respuesta:'', correcta:false, new:true, deleted:0, modified:false}], modified:false, deleted:0, new:true}
    this.questions.push(emptyQuestion)
  }

  deleteAnswer(questionIndex:number, answerIndex:number) {
    this.questions[questionIndex].modified = true
    this.questions[questionIndex].respuesta[answerIndex].deleted = 1
    this.questions[questionIndex].respuesta[answerIndex].modified = true
  }

  deleteQuestion(questionIndex:number) {
    this.questions[questionIndex].deleted = 1
    this.questions[questionIndex].modified = true

    const body: any = this.questions[questionIndex]
    body.id_capacitacion = this.id
    console.log(body)

    this.apiService.putQuestionAndAnswer(body).subscribe({
      next: res => {
        console.log(res)
      }, error: err => {
        console.warn(err)
      }
    })
  }

  onCheckboxChange(questionIndex:number, answerIndex:number) {
    this.questions[questionIndex].modified = true;
    this.questions[questionIndex].respuesta[answerIndex].modified = true
  }
  
  saveQuestion(questionIndex:number) {
    if(this.questions[questionIndex].new === true && this.questions[questionIndex].deleted === 0) {
      const body:any = this.questions[questionIndex]
      body.id_capacitacion = this.id

      this.apiService.postQuestionAndAnswer(body).subscribe({
        next: res => {
          console.log(res)
        }, error: err => {
          console.warn(err)
        }
      })
    } else if(this.questions[questionIndex].new === false && this.questions[questionIndex].deleted === 0) {
      const body: any = this.questions[questionIndex]
      body.id_capacitacion = this.id
      console.log(body)

      this.apiService.putQuestionAndAnswer(body).subscribe({
        next: res => {
          console.log(res)
        }, error: err => {
          console.warn(err)
        }
      })
    }
  }

  modifyQuestion(questionIndex:number) {
    this.questions[questionIndex].modified = true
  }

  modifyAnswer(questionIndex:number, answerIndex:number) {
    this.questions[questionIndex].respuesta[answerIndex].modified = true
    this.questions[questionIndex].modified = true
  }

  assignNumber(questionIndex:number){
    let counter = 1
    this.questions.forEach((element, index) => {
      if(element.deleted === 0) {
        element.number_question = counter
        counter++
      }
    })


    return this.questions[questionIndex].number_question
  }

  moverArriba(questionIndex:number, questionToMove:number){
    if(this.questions[questionIndex - 1].deleted === 1) this.moverArriba(questionIndex, questionToMove-1)
    else {
      const temp1 = this.questions[questionIndex].number_question
      const temp2 = this.questions[questionToMove].number_question

      this.questions[questionIndex].number_question = temp2
      this.questions[questionToMove].number_question = temp1

      const quest1 = this.questions[questionIndex]
      const quest2 = this.questions[questionToMove]

      this.questions[questionIndex] = quest2
      this.questions[questionToMove] = quest1

      this.saveQuestion(questionIndex)
      this.saveQuestion(questionToMove)
    }
  }

  moverAbajo(questionIndex:number, questionToMove){
    if(this.questions[questionIndex + 1].deleted === 1) this.moverArriba(questionIndex, questionToMove+1)
    else {
      const temp1 = this.questions[questionIndex].number_question
      const temp2 = this.questions[questionToMove].number_question

      this.questions[questionIndex].number_question = temp2
      this.questions[questionToMove].number_question = temp1

      const quest1 = this.questions[questionIndex]
      const quest2 = this.questions[questionToMove]

      this.questions[questionIndex] = quest2
      this.questions[questionToMove] = quest1

      this.saveQuestion(questionIndex)
      this.saveQuestion(questionToMove)
    }
  }

  checkFirst(questionIndex:number):boolean {
    let questionLength = this.questions.length -1
    if(questionIndex === 0) return true

    if(this.questions[0].deleted === 1) {
      for(let counter = 0; counter <= questionIndex; counter ++) {
        if(this.questions[counter].deleted === 0 && counter < questionIndex) return false
        else if(counter === questionIndex) return true
      }
    } else {
      return false
    }
  }

  checkLast(questionIndex:number):boolean {
    let questionLength = this.questions.length -1
    if(questionIndex === this.questions.length - 1) return true

    if(this.questions[questionLength].deleted === 1) {
      for(questionLength; questionLength >= 0; questionLength --) {
        if(this.questions[questionLength].deleted === 0 && questionLength > questionIndex) return false
        else if( questionIndex === questionLength ) return true
      }
    } else {
      return false
    }
    return false
  }
}
