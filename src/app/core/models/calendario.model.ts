import { Espacio } from './espacio.model';
export interface DiaCalendario {
  fecha: Date
  esDiaActual: boolean
  esDelMesActual: boolean
  disponible: boolean
  tieneReservas: boolean
}

export interface HoraSeleccionada {
  fecha: Date
  hora: number
}

export interface HorarioDisponible {
  hora: string
  disponible: boolean
  razon?: string
}


export interface CalendarioResponse {
  espacio: Espacio
  periodo: {
    fecha_inicio: string
    fecha_fin: string
  }
  reservas: Array<{
    id: number
    fecha: string
    hora_inicio: string
    hora_fin: string
    estado: string
    usuario: {
      id: number
      nombre: string
    }
  }>
  dias_disponibles: string[]
  dias_ocupados: string[]
}
