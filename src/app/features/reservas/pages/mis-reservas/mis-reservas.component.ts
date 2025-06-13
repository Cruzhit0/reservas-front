import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { ReservasService } from "../../../../core/services/reservas.service"
import type { Reserva } from "../../../../core/models/reserva.model"

@Component({
  selector: "app-mis-reservas",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./mis-reservas.component.html",
})
export class MisReservasComponent implements OnInit {
  private reservasService = inject(ReservasService)

  reservas = signal<Reserva[]>([])
  loading = signal(false)
  error = signal<string | null>(null)
  cancelLoading = signal<number | null>(null)
  successMessage = signal<string | null>(null)

  ngOnInit(): void {
    this.loadReservas()
  }

  private loadReservas(): void {
    this.loading.set(true)
    this.error.set(null)

    this.reservasService.getMisReservas().subscribe({
      next: (reservas) => {
        this.reservas.set(reservas)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set("Error al cargar las reservas")
        this.loading.set(false)
      },
    })
  }

  cancelReserva(id: number): void {
    if (confirm("¿Estás seguro de que quieres cancelar esta reserva?")) {
      this.cancelLoading.set(id)

      this.reservasService.deleteReserva(id).subscribe({
        next: () => {
          this.reservas.update((reservas) => reservas.filter((r) => r.id !== id))
          this.cancelLoading.set(null)
          this.showSuccessMessage("Reserva cancelada exitosamente")
        },
        error: (err) => {
          this.cancelLoading.set(null)
          this.error.set("Error al cancelar la reserva")
        },
      })
    }
  }

  canCancelReserva(reserva: Reserva): boolean {
    const reservaDate = new Date(reserva.fecha)
    const today = new Date()
    return reservaDate > today && reserva.estado !== "cancelada"
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

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  private showSuccessMessage(message: string): void {
    this.successMessage.set(message)
    setTimeout(() => {
      this.successMessage.set(null)
    }, 3000)
  }
}
