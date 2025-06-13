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

export interface ReservaFormData {
  fecha: Date
  hora_inicio: string
  duracion: number
}

export interface ConfirmacionReserva {
  duracion: number
}



