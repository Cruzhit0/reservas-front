import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { FormBuilder } from "@angular/forms"
import { EspaciosService } from "../../../../core/services/espacio.service"
import { ReservasService } from "../../../../core/services/reservas.service"
import { AuthService } from "../../../../core/services/auth.service"
import type { Espacio, CalendarioResponse } from "../../../../core/models/espacio.model"
import { EspacioInfoComponent } from "../../components/espacio-info/espacio-info.component"
import { CalendarioReservasComponent } from "../../components/calendario-reservas/calendario-reservas.component"
import { ModalReservaComponent } from "../../components/modal-reserva/modal-reserva.component"

@Component({
  selector: "app-espacio-detail",
  standalone: true,
  imports: [CommonModule, EspacioInfoComponent, CalendarioReservasComponent, ModalReservaComponent],
  providers: [DatePipe],
  templateUrl: "./espacio-detail.component.html",
})
export class EspacioDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private espaciosService = inject(EspaciosService)
  private reservasService = inject(ReservasService)
  authService = inject(AuthService)
  private datePipe = inject(DatePipe)

  espacio = signal<Espacio | null>(null)
  calendario = signal<CalendarioResponse | null>(null)
  loading = signal(false)
  reservaLoading = signal(false)
  reservaError = signal<string | null>(null)
  reservaSuccess = signal(false)

  // Modal y selección de fecha/hora
  mostrarModalConfirmacion = signal(false)
  fechaSeleccionada = signal<Date | null>(null)
  horaSeleccionada = signal<number | null>(null)

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get("id"))
    if (id) {
      this.loadEspacioDetails(id)
    }
  }

  private loadEspacioDetails(id: number): void {
    this.loading.set(true)

    // Load basic space info
    this.espaciosService.getEspacios().subscribe({
      next: (espacios) => {
        const espacio = espacios.find((e) => e.id === id)
        if (espacio) {
          this.espacio.set(espacio)
          this.loadCalendario(id)
        } else {
          this.router.navigate(["/espacios"])
        }
      },
      error: () => {
        this.router.navigate(["/espacios"])
      },
    })
  }

  private loadCalendario(id: number): void {
    const fechaInicio = new Date()
    fechaInicio.setDate(1) // Primer día del mes actual

    const fechaFin = new Date(fechaInicio)
    fechaFin.setMonth(fechaFin.getMonth() + 2) // Dos meses después

    const fechaInicioStr = this.formatearFecha(fechaInicio)
    const fechaFinStr = this.formatearFecha(fechaFin)

    this.espaciosService.getCalendario(id, fechaInicioStr, fechaFinStr).subscribe({
      next: (calendario) => {
        this.calendario.set(calendario)
        this.loading.set(false)
      },
      error: () => {
        this.loading.set(false)
      },
    })
  }

  onHoraSeleccionada(data: any): void {
    if (!this.authService.isAuthenticated() || !this.espacio()?.disponible) {
      return
    }

    this.fechaSeleccionada.set(data.fecha)
    this.horaSeleccionada.set(data.hora)
    this.mostrarModalConfirmacion.set(true)
  }

  cerrarModalConfirmacion(): void {
    this.mostrarModalConfirmacion.set(false)
    this.reservaError.set(null)
    this.reservaSuccess.set(false)
  }

  confirmarReserva(data: any): void {
    if (
      !this.espacio() ||
      !this.authService.currentUser() ||
      !this.fechaSeleccionada() ||
      this.horaSeleccionada() === null
    ) {
      return
    }

    this.reservaLoading.set(true)
    this.reservaError.set(null)
    this.reservaSuccess.set(false)

    const hora = this.horaSeleccionada()!
    const horaInicio = `${hora.toString().padStart(2, "0")}:00`
    const horaFin = `${(hora + data.duracion).toString().padStart(2, "0")}:00`

    const reservaData = {
      usuario_id: this.authService.currentUser()!.id,
      espacio_id: this.espacio()!.id,
      fecha: this.formatearFecha(this.fechaSeleccionada()!),
      hora_inicio: horaInicio,
      hora_fin: horaFin,
    }

    this.reservasService.createReserva(reservaData).subscribe({
      next: () => {
        this.reservaSuccess.set(true)

        // Recargar calendario para actualizar datos
        this.loadCalendario(this.espacio()!.id)

        this.reservaLoading.set(false)

        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          this.cerrarModalConfirmacion()
        }, 2000)
      },
      error: (err) => {
        this.reservaError.set("Error al crear la reserva. Verifica que el horario esté disponible.")
        this.reservaLoading.set(false)
      },
    })
  }

  private formatearFecha(fecha: Date): string {
    return this.datePipe.transform(fecha, "yyyy-MM-dd") ?? ""
  }
}
