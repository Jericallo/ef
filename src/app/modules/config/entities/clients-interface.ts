export interface Clients {
    id: number,
    nombre: string,
    razon_social: string,
    regimen_fiscal: number,
    RFC: string,
    telefono: number,
    correo: string,
    fecha_creacion: string,
    fecha_modificacion: string | null,
}

export interface ClientsObligations {
    id: number,
    nombre: string,
    razon_social: string,
    obligaciones: number[],
    regimen_fiscal: number,
    RFC: string,
    telefono: number,
    correo: string,
    fecha_creacion: string,
    fecha_modificacion: string | null,
}