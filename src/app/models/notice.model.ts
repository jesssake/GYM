export interface Notice {
  id?: number;
  titulo: string;
  mensaje: string;
  fecha_inicio: string; // ISO date 'YYYY-MM-DD'
  fecha_fin?: string | null; // ISO date or null
  fecha_creacion?: string;
}
