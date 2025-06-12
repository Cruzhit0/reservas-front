import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges, signal } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import type { CalendarioResponse } from "../../../../core/models/espacio.model"

export interface DiaCalendario {
  fecha: Date
  esDiaActual: boolean
  esDelMesActual: boolean
  disponible: boolean
  tieneReservas: boolean
}

@Component({
  selector: "app-calendario-reservas",
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-8">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Calendario de Disponibilidad</h2>
        
        <!-- Filtros de vista -->
        <div class="flex bg-gray-100 rounded-lg p-1">
          @for (vista of vistasCalendario; track vista) {
            <button 
              (click)="cambiarVista(vista)"
              [class.bg-white]="vistaActual() === vista"
              [class.shadow-sm]="vistaActual() === vista"
              [class.text-primary-600]="vistaActual() === vista"
              class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:text-primary-600"
            >
              {{ vista }}
            </button>
          }
        </div>
      </div>

      <!-- Navegación del calendario -->
      <div class="flex justify-between items-center mb-6">
        <button 
          (click)="navegarCalendario('prev')"
          class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Anterior
        </button>
        
        <h3 class="text-xl font-semibold text-gray-800">
          {{ obtenerTituloCalendario() }}
        </h3>
        
        <button 
          (click)="navegarCalendario('next')"
          class="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          Siguiente
          <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Vista de Mes -->
      @if (vistaActual() === 'Mes') {
        <!-- Días de la semana -->
        <div class="grid grid-cols-7 gap-2 mb-4">
          @for (dia of diasSemana; track dia) {
            <div class="text-center py-3 text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">
              {{ dia }}
            </div>
          }
        </div>

        <!-- Calendario -->
        <div class="grid grid-cols-7 gap-2">
          @for (dia of diasCalendario(); track dia.fecha) {
            <div 
              [class]="obtenerClasesDia(dia)"
              (click)="seleccionarFecha(dia)"
              class="aspect-square p-3 cursor-pointer rounded-lg transition-all duration-200 relative group"
            >
              <span class="text-sm font-medium">{{ dia.fecha.getDate() }}</span>
              @if (dia.tieneReservas) {
                <div class="absolute bottom-2 right-2 flex space-x-1">
                  <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
                </div>
              }
              @if (!dia.disponible && dia.esDelMesActual) {
                <div class="absolute inset-0 flex items-center justify-center">
                  <svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Vista de Semana -->
      @if (vistaActual() === 'Semana') {
        <div class="grid grid-cols-7 gap-2 mb-4">
          @for (dia of diasSemana; track dia) {
            <div class="text-center py-3 text-sm font-semibold text-gray-600 bg-gray-50 rounded-lg">
              {{ dia }}
            </div>
          }
        </div>

        <div class="grid grid-cols-7 gap-2">
          @for (dia of diasSemanaActual(); track dia.fecha) {
            <div 
              [class]="obtenerClasesDia(dia)"
              (click)="seleccionarFecha(dia)"
              class="aspect-square p-3 cursor-pointer rounded-lg transition-all duration-200 relative group"
            >
              <span class="text-sm font-medium">{{ dia.fecha.getDate() }}</span>
              @if (dia.tieneReservas) {
                <div class="absolute bottom-2 right-2 flex space-x-1">
                  <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Vista de Día -->
      @if (vistaActual() === 'Día') {
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="p-4 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              {{ fechaActual() | date:'fullDate' }}
            </h3>
          </div>
          
          <div class="divide-y divide-gray-200">
            @for (hora of horasDia(); track hora) {
              <div class="flex p-3 hover:bg-gray-50">
                <div class="w-20 font-medium text-gray-700">{{ hora }}:00</div>
                <div class="flex-1 pl-4">
                  @if (tieneReservaEnHora(hora)) {
                    <div class="bg-primary-100 text-primary-800 p-2 rounded-lg border-l-4 border-primary-500">
                      <p class="font-medium">Reservado</p>
                      <p class="text-sm text-gray-600">{{ getUsuarioReserva(hora) }}</p>
                    </div>
                  } @else {
                    <div class="text-gray-500 text-sm">Disponible</div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Leyenda -->
      <div class="flex items-center justify-center space-x-6 mt-6 pt-6 border-t">
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span class="text-sm text-gray-600">Disponible</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded relative">
            <span class="absolute inset-0 flex items-center justify-center">
              <span class="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
            </span>
          </div>
          <span class="text-sm text-gray-600">Con reservas</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span class="text-sm text-gray-600">No disponible</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-4 h-4 bg-primary-100 border-2 border-primary-400 rounded"></div>
          <span class="text-sm text-gray-600">Hoy</span>
        </div>
      </div>
    </div>
  `,
})
export class CalendarioReservasComponent implements OnChanges {
  @Input() calendario: CalendarioResponse | null = null
  @Output() fechaSeleccionada = new EventEmitter<Date>()

  readonly diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]
  readonly vistasCalendario = ["Día", "Semana", "Mes"]
  readonly horasDia = signal<number[]>(Array.from({ length: 13 }, (_, i) => i + 8)) // 8:00 a 20:00

  vistaActual = signal<string>("Mes")
  fechaActual = signal<Date>(new Date())
  diasCalendario = signal<DiaCalendario[]>([])
  diasSemanaActual = signal<DiaCalendario[]>([])

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["calendario"]) {
      this.generarDiasCalendario()
    }
  }

  cambiarVista(vista: string): void {
    this.vistaActual.set(vista)
    this.generarDiasCalendario()
  }

  navegarCalendario(direccion: "prev" | "next"): void {
    const fecha = new Date(this.fechaActual())

    switch (this.vistaActual()) {
      case "Día":
        fecha.setDate(fecha.getDate() + (direccion === "next" ? 1 : -1))
        break
      case "Semana":
        fecha.setDate(fecha.getDate() + (direccion === "next" ? 7 : -7))
        break
      case "Mes":
        fecha.setMonth(fecha.getMonth() + (direccion === "next" ? 1 : -1))
        break
    }

    this.fechaActual.set(fecha)
    this.generarDiasCalendario()
  }

  generarDiasCalendario(): void {
    const fecha = new Date(this.fechaActual())

    // Generar días para vista de mes
    if (this.vistaActual() === "Mes") {
      const dias: DiaCalendario[] = []

      // Ajustar al primer día del mes
      const primerDia = new Date(fecha.getFullYear(), fecha.getMonth(), 1)

      // Retroceder hasta el domingo
      const diaInicio = new Date(primerDia)
      while (diaInicio.getDay() !== 0) {
        diaInicio.setDate(diaInicio.getDate() - 1)
      }

      // Generar 42 días (6 semanas)
      const fechaTemp = new Date(diaInicio)
      for (let i = 0; i < 42; i++) {
        const diaActual = new Date(fechaTemp)
        dias.push({
          fecha: diaActual,
          esDiaActual: this.esMismaFecha(diaActual, new Date()),
          esDelMesActual: diaActual.getMonth() === fecha.getMonth(),
          disponible: this.esDiaDisponible(diaActual),
          tieneReservas: this.tieneReservas(diaActual),
        })
        fechaTemp.setDate(fechaTemp.getDate() + 1)
      }

      this.diasCalendario.set(dias)
    }

    // Generar días para vista de semana
    if (this.vistaActual() === "Semana" || this.vistaActual() === "Día") {
      const dias: DiaCalendario[] = []

      // Ajustar al domingo de la semana actual
      const inicioSemana = new Date(fecha)
      while (inicioSemana.getDay() !== 0) {
        inicioSemana.setDate(inicioSemana.getDate() - 1)
      }

      // Generar 7 días (1 semana)
      const fechaTemp = new Date(inicioSemana)
      for (let i = 0; i < 7; i++) {
        const diaActual = new Date(fechaTemp)
        dias.push({
          fecha: diaActual,
          esDiaActual: this.esMismaFecha(diaActual, new Date()),
          esDelMesActual: true, // En vista semanal todos son del "mes actual"
          disponible: this.esDiaDisponible(diaActual),
          tieneReservas: this.tieneReservas(diaActual),
        })
        fechaTemp.setDate(fechaTemp.getDate() + 1)
      }

      this.diasSemanaActual.set(dias)
    }
  }

  seleccionarFecha(dia: DiaCalendario): void {
    if (!dia.esDelMesActual || !dia.disponible) return

    this.fechaActual.set(dia.fecha)
    this.fechaSeleccionada.emit(dia.fecha)
  }

  esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    )
  }

  esDiaDisponible(fecha: Date): boolean {
    if (!this.calendario) return false

    const fechaStr = this.formatearFecha(fecha)
    const esHoy = this.esMismaFecha(fecha, new Date())
    const esFuturo = fecha > new Date() || esHoy

    return esFuturo && this.calendario.dias_disponibles.includes(fechaStr)
  }

  tieneReservas(fecha: Date): boolean {
    if (!this.calendario) return false

    const fechaStr = this.formatearFecha(fecha)
    return this.calendario.reservas.some((r) => r.fecha === fechaStr)
  }

  formatearFecha(fecha: Date): string {
    return this.datePipe.transform(fecha, "yyyy-MM-dd") ?? ""
  }

  obtenerClasesDia(dia: DiaCalendario): string {
    let clases = "border-2 "

    if (!dia.esDelMesActual) {
      clases += "text-gray-300 border-gray-100 hover:bg-gray-50 "
    } else if (dia.esDiaActual) {
      clases += "bg-primary-100 border-primary-400 text-primary-800 hover:bg-primary-200 "
    } else if (!dia.disponible) {
      clases += "bg-red-50 border-red-200 text-red-400 cursor-not-allowed "
    } else if (dia.tieneReservas) {
      clases += "bg-yellow-50 border-yellow-200 text-gray-800 hover:bg-yellow-100 hover:border-yellow-300 "
    } else {
      clases += "bg-green-50 border-green-200 text-gray-800 hover:bg-green-100 hover:border-green-300 "
    }

    return clases
  }

  obtenerTituloCalendario(): string {
    const fecha = this.fechaActual()
    switch (this.vistaActual()) {
      case "Día":
        return this.datePipe.transform(fecha, "longDate") ?? ""
      case "Semana":
        const inicioSemana = new Date(fecha)
        while (inicioSemana.getDay() !== 0) {
          inicioSemana.setDate(inicioSemana.getDate() - 1)
        }
        const finSemana = new Date(inicioSemana)
        finSemana.setDate(inicioSemana.getDate() + 6)
        return `${this.datePipe.transform(inicioSemana, "shortDate")} - ${this.datePipe.transform(finSemana, "shortDate")}`
      default:
        return this.datePipe.transform(fecha, "MMMM yyyy") ?? ""
    }
  }

  tieneReservaEnHora(hora: number): boolean {
    if (!this.calendario) return false

    const fechaStr = this.formatearFecha(this.fechaActual())
    const horaStr = `${hora.toString().padStart(2, "0")}:00`

    return this.calendario.reservas.some((r) => {
      if (r.fecha !== fechaStr) return false

      const horaInicio = Number.parseInt(r.hora_inicio.split(":")[0], 10)
      const horaFin = Number.parseInt(r.hora_fin.split(":")[0], 10)

      return hora >= horaInicio && hora < horaFin
    })
  }

  getUsuarioReserva(hora: number): string {
    if (!this.calendario) return ""

    const fechaStr = this.formatearFecha(this.fechaActual())
    const horaStr = `${hora.toString().padStart(2, "0")}:00`

    const reserva = this.calendario.reservas.find((r) => {
      if (r.fecha !== fechaStr) return false

      const horaInicio = Number.parseInt(r.hora_inicio.split(":")[0], 10)
      const horaFin = Number.parseInt(r.hora_fin.split(":")[0], 10)

      return hora >= horaInicio && hora < horaFin
    })

    return reserva ? reserva.usuario.nombre : ""
  }
}
