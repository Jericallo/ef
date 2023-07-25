export interface Documentations {
    id: number,
    nombre: string,
    descripcion: string,
}

export interface DocumentationsTemplate {
    id: number,
    nombre: string,
    contenido?: DocumentationsContent[],
}

export interface DocumentationsContent {
    id_template: number,
    id_documentation: number,
    nombre: string,
    descripcion: string,
}

export interface DocumentationSet {
    es_template: boolean,	
	nombre: string,
	descripcion: string,
}

export interface DocumentationActDct {
    id_documentacion: number,
}