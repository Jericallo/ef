import { Paragraph } from "./paragraph-interface";

export interface Article {
    id?:number,
    id_documento: number;
    id_titulo?:number | null,
    id_capitulo?:number | null,
    id_seccion?:number | null,
    articulo: number;
    indicador?:string | null,
    indice_numerico?: number;
    indice_alfanumerico?: string;
    contenido?: string;
    nombre:string,
    ids_relacionados?: number[];
    fragmentos?: Object[];
    parrafos?:Paragraph[]
}

export interface Article_Title{
    id?:number,
    nombre:string,
    id_documento:number,
    fecha_creacion?: string,
    fecha_modificacion?: string | null
}

export interface Article_Chapter{
    id?:number,
    nombre:string,
    id_documento:number,
    id_titulo:number,
    fecha_creacion?: string,
    fecha_modificacion?:string | null
}

export interface Article_Section{
    id?:number,
    nombre:string,
    id_documento:number,
    id_titulo:number,
    id_capitulo:number,
    fecha_creacion?: string,
    fecha_modificacion?:string | null
}

export interface Article_Parrafo{
    id?:number,
    indicador?:string | null,
    orden:number | null,
    id_articulo:number,
    contenido:string,
    tipo:number,
    numero?:number | null,
    nombre?:string | null,
    relaciones?:string[],
    fecha_creacion?: string,
    fecha_modificacion?:string | null
}