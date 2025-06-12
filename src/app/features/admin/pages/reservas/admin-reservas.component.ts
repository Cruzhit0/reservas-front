import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ReservasService } from "../../../../core/services/reservas.service"
import type { Reserva } from "../../../../core/models/reserva.model"

@Component({
  selector: "app-admin-reservas",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestión de Reservas</h1>
        <p class="text-gray-600">Administra todas las reservas del sistema</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-4">
        <div class="flex flex-wrap gap-4">
          <button
            (click)="filterByStatus('')"
            [class]="selectedStatus() === '' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border'"
            class="px-4 py-2 rounded-lg transition-colors hover:bg-primary-100"
          >
            Todas
          </button>
          <button
            (click)="filterByStatus('pendiente')"
            [class]="selectedStatus() === 'pendiente' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border'"
            class="px-4 py-2 rounded-lg transition-colors hover:bg-primary-100"
          >
            Pendientes
          </button>
          <button
            (click)="filterByStatus('confirmada')"
            [class]="selectedStatus() === 'confirmada' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border'"
            class="px-4 py-2 rounded-lg transition-colors hover:bg-primary-100"
          >
            Confirmadas
          </button>
          <button
            (click)="filterByStatus('cancelada')"
            [class]="selectedStatus() === 'cancelada' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 border'"
            class="px-4 py-2 rounded-lg transition-colors hover:bg-primary-100"
          >
            Canceladas
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            Lista de Reservas ({{ filteredReservas().length }})
          </h2>
        </div>

        @if (loading()) {
          <div class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p class="mt-2 text-gray-600">Cargando reservas...</p>
          </div>
        }

        @if (filteredReservas().length > 0) {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Espacio
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horario
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (reserva of filteredReservas(); track reserva.id) {
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span class="text-primary-600 font-medium text-xs">
                            {{ getInitials(reserva.usuario.nombre) }}
                          </span>
                        </div>
                        <div class="ml-3">
                          <div class="text-sm font-medium text-gray-900">{{ reserva.usuario.nombre }}</div>
                          <div class="text-sm text-gray-500">{{ reserva.usuario.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ reserva.espacio.nombre }}</div>
                      <div class="text-sm text-gray-500">{{ reserva.espacio.tipo | titlecase }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ formatDate(reserva.fecha) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ reserva.hora_inicio }} - {{ reserva.hora_fin }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        [class]="getEstadoClass(reserva.estado)"
                        class="px-2 py-1 text-xs font-medium rounded-full"
                      >
                        {{ reserva.estado | titlecase }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ reserva.id }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else if (!loading()) {
          <div class="text-center py-8">
            <p class="text-gray-600">
              {{ selectedStatus() ? 'No hay reservas con este estado' : 'No hay reservas registradas' }}
            </p>
          </div>
        }
      </div>

      @if (error()) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error() }}
        </div>
      }
    </div>
  `,
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
