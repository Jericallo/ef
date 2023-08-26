export interface Paragraph {
    indicador: string,
    orden: number,
    id_articulo: number,
    contenido: string,
    tipo: string,
    numero: number,
    nombre?: string,
    relaciones: number[]
}