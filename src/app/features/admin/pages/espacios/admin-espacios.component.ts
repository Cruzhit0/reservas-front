import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { EspaciosService } from "../../../../core/services/espacio.service"
import type { Espacio, CreateEspacioRequest } from "../../../../core/models/espacio.model"

@Component({
  selector: "app-espacios",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./admin-espacios.component.html",
})
export class EspaciosComponent implements OnInit {
  private fb = inject(FormBuilder)
  private espaciosService = inject(EspaciosService)

  espacios = signal<Espacio[]>([])
  loading = signal(false)
  createLoading = signal(false)
  updateLoading = signal<number | null>(null)
  createError = signal<string | null>(null)
  successMessage = signal<string | null>(null)
  showCreateForm = signal(false)

  createForm = this.fb.group({
    nombre: ["", Validators.required],
    tipo: ["", Validators.required],
    capacidad: [1, [Validators.required, Validators.min(1)]],
    image_url: ["", [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    disponible: [true],
  })

  ngOnInit(): void {
    this.loadEspacios()
  }

  private loadEspacios(): void {
    this.loading.set(true)
    this.espaciosService.getEspacios().subscribe({
      next: (espacios) => {
        this.espacios.set(espacios)
        this.loading.set(false)
      },
      error: () => {
        this.loading.set(false)
      },
    })
  }

  toggleCreateForm(): void {
    this.showCreateForm.update((show) => !show)
    if (!this.showCreateForm()) {
      this.createForm.reset({ disponible: true })
      this.createError.set(null)
    }
  }

  onCreateSubmit(): void {
    if (this.createForm.valid) {
      this.createLoading.set(true)
      this.createError.set(null)

      const espacioData = this.createForm.value as CreateEspacioRequest

      this.espaciosService.createEspacio(espacioData).subscribe({
        next: (newEspacio) => {
          this.espacios.update((espacios) => [...espacios, newEspacio])
          this.createForm.reset({ disponible: true })
          this.showCreateForm.set(false)
          this.createLoading.set(false)
          this.showSuccessMessage("Espacio creado exitosamente")
        },
        error: (err) => {
          this.createError.set("Error al crear el espacio")
          this.createLoading.set(false)
        },
      })
    }
  }
//   toggleEspacioStatus(espacio: Espacio): void {
//     this.updateLoading.set(espacio.id)

//     this.espaciosService.updateEspacioStatus(espacio.id, !espacio.disponible).subscribe({
//       next: (updatedEspacio) => {
//         this.espacios.update((espacios) => espacios.map((e) => (e.id === espacio.id ? updatedEspacio : e)))
//         this.updateLoading.set(null)
//         this.showSuccessMessage(`Espacio ${updatedEspacio.disponible ? "activado" : "desactivado"} exitosamente`)
//       },
//       error: (err) => {
//         this.updateLoading.set(null)
//         this.showSuccessMessage("Error al actualizar el espacio")
//       },
//     })
//   }

  private showSuccessMessage(message: string): void {
    this.successMessage.set(message)
    setTimeout(() => {
      this.successMessage.set(null)
    }, 3000)
  }
}
