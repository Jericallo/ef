export interface Documents {
  titulo: string;
  editorial?: string | null;
  clasificacion?: number[],
  abreviatura?: string | null;
  num_articulos: number;
  ayo: number;
  fecha_creacion?: string;
  fecha_modificacion?: string;
  nombre?: string | null;
}