export interface Espacio {
  id: number
  nombre: string
  tipo: string
  capacidad: number
  image_url: string
  disponible: boolean
}

export interface CreateEspacioRequest {
  nombre: string
  tipo: string
  ubicacion: string
  capacidad: number
  disponible: boolean
  descripcion: string
  imagen: string
}

export interface DisponibilidadResponse {
  disponible: boolean
  espacio: {
    id: number
    nombre: string
    tipo: string
    capacidad: number
  }
  fecha: string
  hora_inicio: string
  hora_fin: string
  conflictos: Array<{
    id: number
    hora_inicio: string
    hora_fin: string
    usuario: string
  }>
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

export interface CreateEspacioRequest {
  nombre: string
  tipo: string
  capacidad: number
  image_url: string
  disponible: boolean
}

export interface UpdateEspacioRequest {
  disponible: boolean
}
