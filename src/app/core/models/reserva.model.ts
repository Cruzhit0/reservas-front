export interface Reserva {
  id: number
  usuario: {
    id: number
    nombre: string
    email: string
  }
  espacio: {
    id: number
    nombre: string
    tipo: string
  }
  fecha: string
  hora_inicio: string
  hora_fin: string
  estado: "pendiente" | "confirmada" | "cancelada"
}

export interface CreateReservaRequest {
  usuario_id: number
  espacio_id: number
  fecha: string
  hora_inicio: string
  hora_fin: string
}

export interface HorarioDisponible {
  hora: string
  disponible: boolean
  razon?: string
}

export interface CalendarioResponse {
  espacio: {
    id: number
    nombre: string
    tipo: string
    capacidad: number
    image_url: string
  }
  periodo: {
    fecha_inicio: string
    fecha_fin: string
  }
  reservas: Reserva[]
  dias_disponibles: string[]
  dias_ocupados: string[]
}