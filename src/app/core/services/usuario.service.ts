import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { User } from "../models/user.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class UsuariosService {
  private readonly apiUrl = `${environment.API_URL}/api/usuarios`

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/perfil`)
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl)
  }
}
