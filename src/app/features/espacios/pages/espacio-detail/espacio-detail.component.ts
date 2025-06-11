import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ActivatedRoute, Router } from "@angular/router"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { EspaciosService } from "../../../../core/services/espacio.service"
import { ReservasService } from "../../../../core/services/reservas.service"
import { AuthService } from "../../../../core/services/auth.service"
import type { Espacio, CalendarioResponse } from "../../../../core/models/espacio.model"

@Component({
  selector: "app-espacio-detail",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6">
      @if (espacio()) {
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <img 
            [src]="espacio()!.image_url" 
            [alt]="espacio()!.nombre"
            class="w-full h-64 object-cover"
          />
          <div class="p-6">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ espacio()!.nombre }}</h1>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <h3 class="font-semibold text-gray-700">Tipo</h3>
                <p class="text-lg">{{ espacio()!.tipo | titlecase }}</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <h3 class="font-semibold text-gray-700">Capacidad</h3>
                <p class="text-lg">{{ espacio()!.capacidad }} personas</p>
              </div>
              <div class="text-center p-4 bg-gray-50 rounded-lg">
                <h3 class="font-semibold text-gray-700">Estado</h3>
                <p [class]="espacio()!.disponible ? 'text-green-600' : 'text-red-600'" class="text-lg font-medium">
                  {{ espacio()!.disponible ? 'Disponible' : 'No disponible' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        @if (authService.isAuthenticated() && espacio()!.disponible) {
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Hacer Reserva</h2>
            
            <form [formGroup]="reservaForm" (ngSubmit)="onSubmit()">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label for="fecha" class="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    id="fecha"
                    formControlName="fecha"
                    [min]="today"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label for="hora_inicio" class="block text-sm font-medium text-gray-700 mb-2">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    id="hora_inicio"
                    formControlName="hora_inicio"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label for="hora_fin" class="block text-sm font-medium text-gray-700 mb-2">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    id="hora_fin"
                    formControlName="hora_fin"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              @if (reservaError()) {
                <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {{ reservaError() }}
                </div>
              }

              @if (reservaSuccess()) {
                <div class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                  ¡Reserva creada exitosamente!
                </div>
              }

              <button
                type="submit"
                [disabled]="reservaForm.invalid || reservaLoading()"
                class="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                @if (reservaLoading()) {
                  Creando reserva...
                } @else {
                  Crear Reserva
                }
              </button>
            </form>
          </div>
        }

        @if (!authService.isAuthenticated()) {
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p class="text-yellow-800">
              <a href="/auth/login" class="text-primary-500 hover:text-primary-600 font-medium">
                Inicia sesión
              </a> 
              para hacer una reserva
            </p>
          </div>
        }

        @if (calendario()) {
          <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Calendario de Reservas</h2>
            
            @if (calendario()!.reservas.length > 0) {
              <div class="space-y-3">
                @for (reserva of calendario()!.reservas; track reserva.id) {
                  <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p class="font-medium">{{ reserva.fecha }}</p>
                      <p class="text-sm text-gray-600">
                        {{ reserva.hora_inicio }} - {{ reserva.hora_fin }}
                      </p>
                      <p class="text-sm text-gray-500">
                        Reservado por: {{ reserva.usuario.nombre }}
                      </p>
                    </div>
                    <span 
                      [class]="getEstadoClass(reserva.estado)"
                      class="px-2 py-1 rounded text-sm font-medium"
                    >
                      {{ reserva.estado | titlecase }}
                    </span>
                  </div>
                }
              </div>
            } @else {
              <p class="text-gray-600 text-center py-4">No hay reservas en este período</p>
            }
          </div>
        }
      }

      @if (loading()) {
        <div class="text-center py-8">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <p class="mt-2 text-gray-600">Cargando información del espacio...</p>
        </div>
      }
    </div>
  `,
})
export class EspacioDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private espaciosService = inject(EspaciosService)
  private reservasService = inject(ReservasService)
  authService = inject(AuthService)

  espacio = signal<Espacio | null>(null)
  calendario = signal<CalendarioResponse | null>(null)
  loading = signal(false)
  reservaLoading = signal(false)
  reservaError = signal<string | null>(null)
  reservaSuccess = signal(false)

  today = new Date().toISOString().split("T")[0]

  reservaForm = this.fb.group({
    fecha: ["", Validators.required],
    hora_inicio: ["", Validators.required],
    hora_fin: ["", Validators.required],
  })

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
    const fechaInicio = new Date().toISOString().split("T")[0]
    const fechaFin = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    this.espaciosService.getCalendario(id, fechaInicio, fechaFin).subscribe({
      next: (calendario) => {
        this.calendario.set(calendario)
        this.loading.set(false)
      },
      error: () => {
        this.loading.set(false)
      },
    })
  }

  onSubmit(): void {
    if (this.reservaForm.valid && this.espacio() && this.authService.currentUser()) {
      this.reservaLoading.set(true)
      this.reservaError.set(null)
      this.reservaSuccess.set(false)

      const reservaData = {
        usuario_id: this.authService.currentUser()!.id,
        espacio_id: this.espacio()!.id,
        ...this.reservaForm.value,
      }

      this.reservasService.createReserva(reservaData as any).subscribe({
        next: () => {
          this.reservaSuccess.set(true)
          this.reservaForm.reset()
          this.loadCalendario(this.espacio()!.id)
          this.reservaLoading.set(false)
        },
        error: (err) => {
          this.reservaError.set("Error al crear la reserva. Verifica que el horario esté disponible.")
          this.reservaLoading.set(false)
        },
      })
    }
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case "confirmada":
        return "bg-green-100 text-green-800"
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
}
