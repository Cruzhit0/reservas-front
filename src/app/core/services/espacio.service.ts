import { Injectable } from "@angular/core"
import {  HttpClient, HttpParams } from "@angular/common/http"
import type { Observable } from "rxjs"
import type { Espacio, DisponibilidadResponse, CalendarioResponse } from "../models/espacio.model"
import { environment } from "../../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class EspaciosService {
  private readonly apiUrl = `${environment.API_URL}/api/espacios`

  constructor(private http: HttpClient) {}

  getEspacios(): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(this.apiUrl)
  }

  getEspaciosPorTipo(tipo: string): Observable<Espacio[]> {
    return this.http.get<Espacio[]>(`${this.apiUrl}/${tipo}`)
  }

  checkDisponibilidad(
    espacioId: number,
    fecha: string,
    horaInicio: string,
    horaFin: string,
  ): Observable<DisponibilidadResponse> {
    const params = new HttpParams().set("fecha", fecha).set("hora_inicio", horaInicio).set("hora_fin", horaFin)

    return this.http.get<DisponibilidadResponse>(`${this.apiUrl}/disponibilidad/${espacioId}`, { params })
  }

  getCalendario(espacioId: number, fechaInicio: string, fechaFin: string): Observable<CalendarioResponse> {
    const params = new HttpParams().set("fecha_inicio", fechaInicio).set("fecha_fin", fechaFin)

    return this.http.get<CalendarioResponse>(`${this.apiUrl}/${espacioId}/calendario`, { params })
  }
}
