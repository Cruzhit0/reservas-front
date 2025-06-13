import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { EspaciosService } from "../../../../core/services/espacio.service"
import { ReservasService } from "../../../../core/services/reservas.service"
import { UsuariosService } from "../../../../core/services/usuario.service"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./admin-dashboard.component.html", 
})
export class DashboardComponent implements OnInit {
  private espaciosService = inject(EspaciosService)
  private reservasService = inject(ReservasService)
  private usuariosService = inject(UsuariosService)

  stats = signal({
    totalEspacios: 0,
    espaciosActivos: 0,
    reservasActivas: 0,
    totalUsuarios: 0,
  })

  ngOnInit(): void {
    this.loadStats()
  }

  private loadStats(): void {
    // Load spaces stats
    this.espaciosService.getEspacios().subscribe({
      next: (espacios) => {
        this.stats.update((current) => ({
          ...current,
          totalEspacios: espacios.length,
          espaciosActivos: espacios.filter((e) => e.disponible).length,
        }))
      },
    })

    // Load reservations stats
    this.reservasService.getMisReservas().subscribe({
      next: (reservas) => {
        const today = new Date().toISOString().split("T")[0]
        const activeReservations = reservas.filter((r) => r.fecha >= today && r.estado !== "cancelada").length

        this.stats.update((current) => ({
          ...current,
          reservasActivas: activeReservations,
        }))
      },
    })

    // Load users stats
    this.usuariosService.getAllUsers().subscribe({
      next: (usuarios) => {
        this.stats.update((current) => ({
          ...current,
          totalUsuarios: usuarios.length,
        }))
      },
    })
  }
}
