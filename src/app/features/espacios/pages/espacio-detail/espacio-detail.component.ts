import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { EspaciosService } from "../../../../core/services/espacio.service"
import { ReservasService } from "../../../../core/services/reservas.service"
import { AuthService } from "../../../../core/services/auth.service"
import type { Espacio  } from "../../../../core/models/espacio.model"
import type { CalendarioResponse,HoraSeleccionada } from "../../../../core/models/calendario.model"
import { ConfirmacionReserva } from "../../../../core/models/reserva.model"
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

 private loadCalendario(id: number, fecha?: Date): void {
    const fechaConsulta = fecha || new Date()
    const fechaStr = this.formatearFecha(fechaConsulta)

    console.log("Cargando calendario para fecha:", fechaStr)

    this.espaciosService.getCalendario(id, fechaStr, fechaStr).subscribe({
      next: (calendario) => {
        this.calendario.set(calendario)
        this.loading.set(false)
      },
      error: (err) => {
        console.error("Error al cargar calendario:", err)
        this.loading.set(false)
      },
    })
}

// Agregar método para escuchar cambios de fecha del calendario
onFechaCambio(fecha: Date): void {
    if (this.espacio()) {
        this.loadCalendario(this.espacio()!.id, fecha)
    }
}
  onHoraSeleccionada(data: HoraSeleccionada): void {
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

  // Actualizar el método confirmarReserva para asegurar el formato correcto de fecha
  confirmarReserva(data: ConfirmacionReserva): void {
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

    const fechaFormateada = this.formatearFecha(this.fechaSeleccionada()!)

    const reservaData = {
      usuario_id: this.authService.currentUser()!.id,
      espacio_id: this.espacio()!.id,
      fecha: fechaFormateada, 
      hora_inicio: horaInicio,
      hora_fin: horaFin,
    }

    this.reservasService.createReserva(reservaData).subscribe({
      next: () => {
        this.reservaSuccess.set(true)
        // Recargar el calendario con la fecha actual de la reserva
        this.loadCalendario(this.espacio()!.id, this.fechaSeleccionada()!)
        this.reservaLoading.set(false)

        setTimeout(() => {
          this.cerrarModalConfirmacion()
        }, 20)
      },
      error: (err) => {
        console.error("Error al crear reserva:", err) 
        this.reservaError.set("Error al crear la reserva. Verifica que el horario esté disponible.")
        this.reservaLoading.set(false)
      },
    })
  }

  private formatearFecha(fecha: Date): string {
    // Asegurarse de que siempre devuelva YYYY-MM-DD
    const year = fecha.getFullYear()
    const month = (fecha.getMonth() + 1).toString().padStart(2, "0")
    const day = fecha.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }
}
