import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReservasService } from "../../../../core/services/reservas.service"
import type { Reserva } from "../../../../core/models/reserva.model"

@Component({
  selector: "app-admin-reservas",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./admin-reservas.component.html", 
})
export class AdminReservasComponent implements OnInit {
  private reservasService = inject(ReservasService)

  reservas = signal<Reserva[]>([])
  filteredReservas = signal<Reserva[]>([])
  selectedStatus = signal<string>("")
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.loadReservas()
  }

  private loadReservas(): void {
    this.loading.set(true)
    this.error.set(null)

    // Note: This would need to be a different endpoint for admin to get ALL reservations
    // For now, using the existing endpoint
    this.reservasService.getMisReservas().subscribe({
      next: (reservas) => {
        this.reservas.set(reservas)
        this.filteredReservas.set(reservas)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set("Error al cargar las reservas")
        this.loading.set(false)
      },
    })
  }

  filterByStatus(status: string): void {
    this.selectedStatus.set(status)
    if (status === "") {
      this.filteredReservas.set(this.reservas())
    } else {
      const filtered = this.reservas().filter((reserva) => reserva.estado === status)
      this.filteredReservas.set(filtered)
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

  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  getInitials(nombre: string): string {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
}
