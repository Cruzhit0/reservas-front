import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { AuthService } from "../../../../core/services/auth.service"

@Component({
  selector: "app-perfil",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
        
        @if (authService.currentUser()) {
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <p class="text-lg text-gray-900">{{ authService.currentUser()!.nombre }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <p class="text-lg text-gray-900">{{ authService.currentUser()!.email }}</p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuario
              </label>
              <span 
                [class]="authService.currentUser()!.tipo === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                class="px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ authService.currentUser()!.tipo | titlecase }}
              </span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class PerfilComponent {
  authService = inject(AuthService)
}
