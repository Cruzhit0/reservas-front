import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges, signal } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import type { CalendarioResponse } from "../../../../core/models/espacio.model"
import type { User } from "../../../../core/models/user.model"

export interface HorarioDisponible {
  hora: string
  disponible: boolean
  razon?: string
}

export interface ReservaFormData {
  fecha: Date
  hora_inicio: string
  duracion: number
}

@Component({
  selector: "app-modal-reserva",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
         (click)="cerrarModal($event)">
      <div class="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
           (click)="$event.stopPropagation()">
        
        <!-- Header del modal -->
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-2xl font-bold text-gray-900">Hacer Reserva</h3>
            <button 
              (click)="cerrar.emit()"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p class="text-gray-600 mt-2">
            {{ fecha | date:'fullDate' }}
          </p>
        </div>

        <!-- Contenido del modal -->
        <div class="p-6">
          @if (!usuario) {
            <div class="text-center py-8">
              <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <p class="text-gray-600 mb-4">Necesitas iniciar sesión para hacer una reserva</p>
              <a href="/auth/login" class="inline-block bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                Iniciar Sesión
              </a>
            </div>
          } @else {
            <form [formGroup]="reservaForm" (ngSubmit)="onSubmit()">
              <!-- Horarios disponibles -->
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700 mb-3">
                  Selecciona un horario disponible
                </label>
                <div class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  @for (horario of horariosDisponibles(); track horario.hora) {
                    <button
                      type="button"
                      [disabled]="!horario.disponible"
                      (click)="seleccionarHorario(horario.hora)"
                      [class.bg-primary-500]="horarioSeleccionado() === horario.hora"
                      [class.text-white]="horarioSeleccionado() === horario.hora"
                      [class.bg-gray-100]="!horario.disponible"
                      [class.text-gray-400]="!horario.disponible"
                      [class.cursor-not-allowed]="!horario.disponible"
                      class="p-3 text-sm border rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors text-left"
                    >
                      <div class="font-medium">{{ horario.hora }}</div>
                      @if (!horario.disponible && horario.razon) {
                        <div class="text-xs text-gray-500 mt-1">{{ horario.razon }}</div>
                      }
                    </button>
                  }
                </div>
              </div>

              <!-- Duración -->
              <div class="mb-6">
                <label for="duracion" class="block text-sm font-medium text-gray-700 mb-2">
                  Duración (horas)
                </label>
                <select
                  id="duracion"
                  formControlName="duracion"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="1">1 hora</option>
                  <option value="2">2 horas</option>
                  <option value="3">3 horas</option>
                  <option value="4">4 horas</option>
                </select>
              </div>

              @if (errorSignal()) {
                <div class="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ errorSignal() }}
                  </div>
                </div>
              }

              @if (successSignal()) {
                <div class="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  <div class="flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    ¡Reserva creada exitosamente!
                  </div>
                </div>
              }

              <!-- Botones -->
              <div class="flex space-x-3">
                <button
                  type="button"
                  (click)="cerrar.emit()"
                  class="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  [disabled]="reservaForm.invalid || loadingSignal() || !horarioSeleccionado()"
                  class="flex-1 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  @if (loadingSignal()) {
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando...
                  } @else {
                    Crear Reserva
                  }
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class ModalReservaComponent implements OnChanges {
  @Input() fecha!: Date
  @Input() calendario: CalendarioResponse | null = null
  @Input() usuario: User | null = null
  @Input() loading = false
  @Input() error: string | null = null
  @Input() success = false

  @Output() cerrar = new EventEmitter<void>()
  @Output() reservar = new EventEmitter<ReservaFormData>()

  horariosDisponibles = signal<HorarioDisponible[]>([])
  horarioSeleccionado = signal<string | null>(null)
  
  // Signals para el template
  loadingSignal = signal<boolean>(false)
  errorSignal = signal<string | null>(null)
  successSignal = signal<boolean>(false)
  
  reservaForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) {
    this.reservaForm = this.fb.group({
      duracion: [1, Validators.required],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["fecha"] || changes["calendario"]) {
      this.generarHorariosDisponibles()
    }
    
    // Actualizar signals cuando cambien los inputs
    if (changes["loading"]) {
      this.loadingSignal.set(this.loading)
    }
    
    if (changes["error"]) {
      this.errorSignal.set(this.error)
    }
    
    if (changes["success"]) {
      this.successSignal.set(this.success)
    }
  }

  private generarHorariosDisponibles(): void {
    const horarios: HorarioDisponible[] = []

    if (!this.fecha || !this.calendario) {
      this.horariosDisponibles.set(horarios)
      return
    }

    const fechaStr = this.formatearFecha(this.fecha)
    const reservasDelDia = this.calendario.reservas.filter((r) => r.fecha === fechaStr) || []

    // Generar horarios de 8:00 a 20:00
    for (let hora = 8; hora <= 20; hora++) {
      const horaStr = `${hora.toString().padStart(2, "0")}:00`

      // Verificar si está ocupado
      const reservaEnHora = reservasDelDia.find((reserva) => {
        const inicioReserva = Number.parseInt(reserva.hora_inicio.split(":")[0], 10)
        const finReserva = Number.parseInt(reserva.hora_fin.split(":")[0], 10)
        return hora >= inicioReserva && hora < finReserva
      })

      // Verificar si es horario pasado (solo para hoy)
      const esHoy = this.esMismaFecha(this.fecha, new Date())
      const esHoraPasada = esHoy && hora <= new Date().getHours()

      let disponible = true
      let razon = ""

      if (esHoraPasada) {
        disponible = false
        razon = "Hora pasada"
      } else if (reservaEnHora) {
        disponible = false
        razon = `Reservado por ${reservaEnHora.usuario.nombre}`
      }

      horarios.push({
        hora: horaStr,
        disponible,
        razon,
      })
    }

    this.horariosDisponibles.set(horarios)
  }

  seleccionarHorario(hora: string): void {
    this.horarioSeleccionado.set(hora)
  }

  cerrarModal(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cerrar.emit()
    }
  }

  onSubmit(): void {
    if (this.reservaForm.valid && this.horarioSeleccionado()) {
      const duracion = Number(this.reservaForm.value.duracion)

      this.reservar.emit({
        fecha: this.fecha,
        hora_inicio: this.horarioSeleccionado()!,
        duracion,
      })
    }
  }

  private formatearFecha(fecha: Date): string {
    return this.datePipe.transform(fecha, "yyyy-MM-dd") ?? ""
  }

  private esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    )
  }
}