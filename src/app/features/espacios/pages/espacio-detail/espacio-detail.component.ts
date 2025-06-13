import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { FormBuilder } from "@angular/forms"
import { EspaciosService } from "../../../../core/services/espacio.service"
import { ReservasService } from "../../../../core/services/reservas.service"
import { AuthService } from "../../../../core/services/auth.service"
import type { Espacio, CalendarioResponse } from "../../../../core/models/espacio.model"
import { EspacioInfoComponent } from "../components/espacio-info.component"
import { CalendarioReservasComponent } from "../components/calendario-reservas.component"
import { ModalReservaComponent } from "../components/modal-reserva.component"

@Component({
  selector: "app-espacio-detail",
  standalone: true,
  imports: [CommonModule, EspacioInfoComponent, CalendarioReservasComponent, ModalReservaComponent],
  providers: [DatePipe],
  template: `
    <div class="max-w-6xl mx-auto space-y-8">
      @if (espacio()) {
        <!-- Información del espacio -->
        <app-espacio-info [espacio]="espacio()!">
          <!-- Alerta para usuarios no autenticados -->
          @if (!authService.isAuthenticated()) {
            <div class="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6 text-center mt-6">
              <div class="flex items-center justify-center mb-4">
                <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <p class="text-yellow-800 text-lg mb-4">¡Inicia sesión para hacer reservas!</p>
              <a href="/auth/login" 
                class="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Iniciar Sesión
              </a>
            </div>
          }
        </app-espacio-info>

        <!-- Calendario -->
        @if (calendario()) {
          <app-calendario-reservas 
            [calendario]="calendario()" 
            (horaSeleccionada)="onHoraSeleccionada($event)"
          ></app-calendario-reservas>
        }
      }

      @if (loading()) {
        <div class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          <p class="mt-4 text-gray-600 text-lg">Cargando información del espacio...</p>
        </div>
      }
    </div>

    <!-- Modal de Confirmación de Reserva -->
    @if (mostrarModalConfirmacion() && fechaSeleccionada() !== null && horaSeleccionada() !== null) {
      <app-modal-reserva
        [fecha]="fechaSeleccionada()!"
        [hora]="horaSeleccionada()!"
        [loading]="reservaLoading()"
        [error]="reservaError()"
        [success]="reservaSuccess()"
        (cerrar)="cerrarModalConfirmacion()"
        (confirmar)="confirmarReserva($event)"
      ></app-modal-reserva>
    }
  `,
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
