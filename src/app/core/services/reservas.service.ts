import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Reserva, CreateReservaRequest } from "../models/reserva.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class ReservasService {
  private readonly apiUrl = `${environment.API_URL}/api/reservas`

  constructor(private http: HttpClient) {}

  createReserva(reservaData: CreateReservaRequest): Observable<Reserva> {
    console.log("Creating reservation with data:", reservaData)
    return this.http.post<Reserva>(this.apiUrl, reservaData)
  }

  getMisReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/mis-reservas`)
  }

  getReservasPorFecha(fecha: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/fecha/${fecha}`)
  }

  deleteReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
  }
}
