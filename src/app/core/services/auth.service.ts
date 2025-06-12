import { Injectable, signal } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { type Observable, tap } from "rxjs"
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "../models/user.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly apiUrl = `${environment.API_URL}/api/auth`

  currentUser = signal<User | null>(null)
  isAuthenticated = signal<boolean>(false)

  constructor(private http: HttpClient) {
    this.loadUserFromStorage()
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        this.setAuthData(response)
      }),
    )
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap((response) => {
        this.setAuthData(response)
      }),
    )
  }

  logout(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    this.currentUser.set(null)
    this.isAuthenticated.set(false)
  }

  getToken(): string | null {
    return localStorage.getItem("token")
  }

  private setAuthData(response: AuthResponse): void {
    localStorage.setItem("token", response.token)
    localStorage.setItem("user", JSON.stringify(response.usuario))
    this.currentUser.set(response.usuario)
    this.isAuthenticated.set(true)
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        this.currentUser.set(user)
        this.isAuthenticated.set(true)
      } catch (error) {
        this.logout()
      }
    }
  }

}
