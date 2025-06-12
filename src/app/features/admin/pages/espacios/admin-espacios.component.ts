import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { EspaciosService } from "../../../../core/services/espacio.service"
import type { Espacio, CreateEspacioRequest } from "../../../../core/models/espacio.model"

@Component({
  selector: "app-espacios",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestión de Espacios</h1>
          <p class="text-gray-600">Administra los espacios disponibles</p>
        </div>
        <button
          (click)="toggleCreateForm()"
          class="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
        >
          {{ showCreateForm() ? 'Cancelar' : 'Nuevo Espacio' }}
        </button>
      </div>

      <!-- Create Form -->
      @if (showCreateForm()) {
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Crear Nuevo Espacio</h2>
          
          <form [formGroup]="createForm" (ngSubmit)="onCreateSubmit()">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="nombre" class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Espacio
                </label>
                <input
                  type="text"
                  id="nombre"
                  formControlName="nombre"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ej: Salón Principal"
                />
              </div>
              <div>
                <label for="tipo" class="block text-sm font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  id="tipo"
                  formControlName="tipo"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="salon">Salón</option>
                  <option value="auditorio">Auditorio</option>
                  <option value="sala">Sala</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label for="capacidad" class="block text-sm font-medium text-gray-700 mb-2">
                  Capacidad
                </label>
                <input
                  type="number"
                  id="capacidad"
                  formControlName="capacidad"
                  min="1"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Número de personas"
                />
              </div>
              <div>
                <label for="image_url" class="block text-sm font-medium text-gray-700 mb-2">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  id="image_url"
                  formControlName="image_url"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div class="mb-4">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  formControlName="disponible"
                  class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-gray-700">Disponible para reservas</span>
              </label>
            </div>

            @if (createError()) {
              <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {{ createError() }}
              </div>
            }

            <div class="flex space-x-4">
              <button
                type="submit"
                [disabled]="createForm.invalid || createLoading()"
                class="bg-primary-500 text-white px-6 py-2 rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
              >
                @if (createLoading()) {
                  Creando...
                } @else {
                  Crear Espacio
                }
              </button>
              <button
                type="button"
                (click)="toggleCreateForm()"
                class="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Spaces List -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Lista de Espacios</h2>
        </div>

        @if (loading()) {
          <div class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p class="mt-2 text-gray-600">Cargando espacios...</p>
          </div>
        }

        @if (espacios().length > 0) {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Espacio
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacidad
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @for (espacio of espacios(); track espacio.id) {
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <img 
                          [src]="espacio.image_url" 
                          [alt]="espacio.nombre"
                          class="h-10 w-10 rounded-lg object-cover mr-4"
                        />
                        <div>
                          <div class="text-sm font-medium text-gray-900">{{ espacio.nombre }}</div>
                          <div class="text-sm text-gray-500">ID: {{ espacio.id }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {{ espacio.tipo | titlecase }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ espacio.capacidad }} personas
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        [class]="espacio.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                        class="px-2 py-1 text-xs font-medium rounded-full"
                      >
                        {{ espacio.disponible ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    
                        <!-- (click)="toggleEspacioStatus(espacio)"   -->
                    <button
                        [disabled]="updateLoading() === espacio.id"
                        [class]="espacio.disponible ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'"
                        class="disabled:opacity-50"
                      >
                        @if (updateLoading() === espacio.id) {
                          Actualizando...
                        } @else {
                          {{ espacio.disponible ? 'Desactivar' : 'Activar' }}
                        }
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else if (!loading()) {
          <div class="text-center py-8">
            <p class="text-gray-600">No hay espacios registrados</p>
          </div>
        }
      </div>

      @if (successMessage()) {
        <div class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          {{ successMessage() }}
        </div>
      }
    </div>
  `,
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
