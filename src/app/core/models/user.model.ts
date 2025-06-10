export interface User {
  id: number
  nombre: string
  email: string
  tipo: "usuario" | "admin"
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  nombre: string
  email: string
  password: string
  tipo: "usuario"
}

export interface AuthResponse {
  token: string
  user: User
}
