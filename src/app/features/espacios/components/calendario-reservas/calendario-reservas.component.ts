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

export interface HoraSeleccionada {
  fecha: Date
  hora: number
}

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

  seleccionarDia(dia: DiaCalendario): void {
    if (!dia.esDelMesActual || !dia.disponible) return

    // Cambiar a la vista de día y actualizar la fecha
    this.fechaActual.set(dia.fecha)
    this.vistaActual.set("Día")
    this.generarDiasCalendario()
  }

  seleccionarHora(hora: number): void {
    if (!this.esHoraDisponible(hora)) return

    this.horaSeleccionada.emit({
      fecha: this.fechaActual(),
      hora,
    })
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

  esHoraDisponible(hora: number): boolean {
    if (!this.calendario) return false

    // Verificar si es horario pasado (solo para hoy)
    const esHoy = this.esMismaFecha(this.fechaActual(), new Date())
    const esHoraPasada = esHoy && hora <= new Date().getHours()

    if (esHoraPasada) return false
    if (this.tieneReservaEnHora(hora)) return false

    return true
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
}
