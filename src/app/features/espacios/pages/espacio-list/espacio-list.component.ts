import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { EspaciosService } from "../../../../core/services/espacio.service"
import type { Espacio } from "../../../../core/models/espacio.model"

@Component({
  selector: "app-espacios-list",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./espacio-list.component.html",
})
export class EspaciosListComponent implements OnInit {
  private espaciosService = inject(EspaciosService)

  espacios = signal<Espacio[]>([])
  filteredEspacios = signal<Espacio[]>([])
  selectedType = signal<string>("")
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.loadEspacios()
  }

  private loadEspacios(): void {
    this.loading.set(true)
    this.error.set(null)

    this.espaciosService.getEspacios().subscribe({
      next: (espacios) => {
        this.espacios.set(espacios)
        this.filteredEspacios.set(espacios)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set("Error al cargar los espacios")
        this.loading.set(false)
      },
    })
  }

  filterByType(tipo: string): void {
    this.selectedType.set(tipo)
    if (tipo === "") {
      this.filteredEspacios.set(this.espacios())
    } else {
      const filtered = this.espacios().filter((espacio) => espacio.tipo === tipo)
      this.filteredEspacios.set(filtered)
    }
  }
}
