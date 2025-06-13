import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges, signal } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import type { CalendarioResponse,HoraSeleccionada } from "../../../../core/models/calendario.model"



@Component({
  selector: "app-calendario-reservas",
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe],
  templateUrl: "./calendario-reservas.component.html",
})
export class CalendarioReservasComponent implements OnChanges {
  @Input() calendario: CalendarioResponse | null = null
  @Output() horaSeleccionada = new EventEmitter<HoraSeleccionada>()
   @Output() fechaCambio = new EventEmitter<Date>() 


  fechaActual = signal<Date>(new Date())
  horasDia = signal<number[]>([])

  constructor(private datePipe: DatePipe) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["calendario"]) {
      this.generarHorasDia()
    }
  }

  cambiarFecha(dias: number): void {
    const nuevaFecha = new Date(this.fechaActual())
    nuevaFecha.setDate(nuevaFecha.getDate() + dias)
    this.fechaActual.set(nuevaFecha)
    this.generarHorasDia()
    this.fechaCambio.emit(nuevaFecha) 
  }


  cambiarFechaInput(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.value) {
      // El formato del input date es YYYY-MM-DD
      const [year, month, day] = input.value.split("-").map(Number)
      // Crear fecha correctamente (month es 0-indexed en JavaScript)
      const nuevaFecha = new Date(year, month - 1, day)
      this.fechaActual.set(nuevaFecha)
      this.generarHorasDia()
      this.fechaCambio.emit(nuevaFecha)
    }
  }

  formatearFechaInput(fecha: Date): string {
    // Este método ya devuelve YYYY-MM-DD para el input de tipo date
    const year = fecha.getFullYear()
    const month = (fecha.getMonth() + 1).toString().padStart(2, "0")
    const day = fecha.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  generarHorasDia(): void {
    // Generar horas de 8:00 a 20:00
    const horas = Array.from({ length: 13 }, (_, i) => i + 8)
    this.horasDia.set(horas)
  }

  seleccionarHora(hora: number): void {
    if (!this.esHoraDisponible(hora)) return

    this.horaSeleccionada.emit({
      fecha: this.fechaActual(),
      hora,
    })
  }

  formatearHora(hora: number): string {
    return `${hora}:00`
  }

  formatearFecha(fecha: Date): string {
    // Asegurarse de que siempre devuelva YYYY-MM-DD
    const year = fecha.getFullYear()
    const month = (fecha.getMonth() + 1).toString().padStart(2, "0")
    const day = fecha.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  tieneReservaEnHora(hora: number): boolean {
    if (!this.calendario) return false

    const fechaStr = this.formatearFecha(this.fechaActual())
    // console.log("Verificando reservas para fecha:", fechaStr, "hora:", hora) // Para depuración

    return this.calendario.reservas.some((r) => {
      if (r.fecha !== fechaStr) return false

      const horaInicio = Number.parseInt(r.hora_inicio.split(":")[0], 10)
      const horaFin = Number.parseInt(r.hora_fin.split(":")[0], 10)

      return hora >= horaInicio && hora < horaFin
    })
  }

  esHoraDisponible(hora: number): boolean {
    if (!this.calendario) return false

    // Verificar si es horario pasado (solo para hoy)
    const esHoy = this.esMismaFecha(this.fechaActual(), new Date())
    const esHoraPasada = esHoy && hora <= new Date().getHours()

    if (esHoraPasada) return false
    if (this.tieneReservaEnHora(hora)) return false

    // Verificar si el día está en los días disponibles
    const fechaStr = this.formatearFecha(this.fechaActual())
    if (!this.calendario.dias_disponibles.includes(fechaStr)) return false

    return true
  }

  hayHorasDisponibles(): boolean {
    return this.horasDia().some((hora) => this.esHoraDisponible(hora))
  }

  getUsuarioReserva(hora: number): string {
    if (!this.calendario) return ""

    const fechaStr = this.formatearFecha(this.fechaActual())

    const reserva = this.calendario.reservas.find((r) => {
      if (r.fecha !== fechaStr) return false

      const horaInicio = Number.parseInt(r.hora_inicio.split(":")[0], 10)
      const horaFin = Number.parseInt(r.hora_fin.split(":")[0], 10)

      return hora >= horaInicio && hora < horaFin
    })

    return reserva ? reserva.usuario.nombre : ""
  }

  esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    )
  }
}
