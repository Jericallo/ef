export interface Obligations {
    id_cliente: number,
    nombre: string | null,
    descripcion?: string | null,
    prioridad?: number | null,
    indicador_riesgo?: number | null,
    id_periodo?: number | null,
    periodo: number,
    fecha_cumplimiento: string | null,
    fecha_inicio?: string,
    alertas: ObligationsAlert[],
    con_documento?: boolean,
	texto_documentos?: string,
    documentaciones: number[],
}

export interface ObligationsAlert {
    mensaje: string,
    periodo: number,
}

export interface ObligationsType {
    nombre: string,
    color: string,
}

export interface ObligationsPeriod {
    nombre: string,
    minutos?: number,
}

export interface ObligationsGet {
    id: number,
    nombre: string,
    descripcion: string,
    fecha_vencimiento: number | null,
    fecha_inicio: number,
    color: string,
    nombre_periodo: string,
    minutos: number,
    selected?: boolean,
}

export interface ObligationsClient {
    id_cliente: number | null,
    array_obligaciones: number[],
}

export interface ObligationsRegime {
    id_regimen: number | null,
    array_obligaciones: number[],
}