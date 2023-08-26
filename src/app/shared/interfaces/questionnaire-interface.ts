export interface Questionnaire {
    id: number,
    contenido: string,
    id_capacitacion: number,
    descripcion: string,
    id_video: number,
    respuestas: QuestionnaireAnswers[],
}

export interface QuestionnaireAnswers {
    id: number,
    inciso: number,
    respuesta: string,
    id_pregunta: number,
    es_correcta: null,
}

export interface QuestionnaireSave {
    id_usuario: number,
	id_capacitacion: number,
    preguntas: QuestionnaireAnswersSave[],
}

export interface QuestionnaireAnswersSave {
    id_pregunta: number,
    id_respuesta: number,
}