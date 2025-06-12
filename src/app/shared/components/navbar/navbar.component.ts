import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white shadow-lg">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-gray-800">Sistema de Reservas</h1>
            <div class="hidden md:flex space-x-4">
              <a routerLink="/espacios" 
                 routerLinkActive="text-primary-600 border-b-2 border-primary-600"
                 class="text-gray-600 hover:text-primary-600 px-3 py-2 transition-colors">
                Espacios
              </a>
              @if (authService.isAuthenticated()) {
                <a routerLink="/reservas" 
                   routerLinkActive="text-primary-600 border-b-2 border-primary-600"
                   class="text-gray-600 hover:text-primary-600 px-3 py-2 transition-colors">
                  Mis Reservas
                </a>
              }
              @if (authService.isAuthenticated() && authService.currentUser()?.tipo === 'admin') {
                <a routerLink="/admin" 
                   routerLinkActive="text-primary-600 border-b-2 border-primary-600"
                   class="text-gray-600 hover:text-primary-600 px-3 py-2 transition-colors">
                  Administración
                </a>
              }
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            @if (authService.isAuthenticated()) {
              <span class="text-gray-600">Hola, {{ authService.currentUser()?.nombre }}</span>
              <a routerLink="/perfil" class="text-gray-600 hover:text-primary-600">Perfil</a>
              <button (click)="logout()" 
                      class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                Cerrar Sesión
              </button>
            } @else {
              <a routerLink="/auth/login" 
                 class="text-gray-600 hover:text-primary-600">Iniciar Sesión</a>
              <a routerLink="/auth/register" 
                 class="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors">
                Registrarse
              </a>
            }
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  authService = inject(AuthService)
  private router = inject(Router)

  logout(): void {
    this.authService.logout()
    this.router.navigate(["/espacios"])
  }
}
