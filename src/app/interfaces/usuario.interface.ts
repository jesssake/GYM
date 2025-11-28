/**
 * Interfaz para el objeto Usuario completo
 */
export interface Usuario { // 🚨 DEBE INCLUIR 'export'
    id: string;
    nombre: string;
    email: string;
    rol: 'Cliente' | 'Admin' | string;
    fechaNacimiento: string;
    peso: number;
    altura: number;
    meta: 'perder-peso' | 'ganar-musculo' | 'mantenerse' | string;
    fotoUrl: string | null;
}
