export interface Espacio {
  id: number
  nombre: string
  tipo: string
  capacidad: number
  image_url: string
  disponible: boolean
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

