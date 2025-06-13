import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule, Router } from "@angular/router"
import { AuthService } from "../../../core/services/auth.service"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
 <nav class="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100 sticky top-0 z-50">
  <div class="container mx-auto px-6">
    <div class="flex justify-between items-center h-20">
      <!-- Logo y Enlaces Principales -->
      <div class="flex items-center space-x-12">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-primary-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Sistema de Reservas
          </h1>
        </div>

        <!-- Enlaces de Navegación -->
        <div class="hidden lg:flex items-center space-x-1">
          <a routerLink="/espacios" 
             routerLinkActive="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200"
             class="group flex items-center space-x-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-xl transition-all duration-200 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <span>Espacios</span>
          </a>

          @if (authService.isAuthenticated()) {
            <a routerLink="/reservas" 
               routerLinkActive="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200"
               class="group flex items-center space-x-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-xl transition-all duration-200 font-medium">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0l-2 2m8-2l2 2m-2-2v12a2 2 0 01-2 2H8a2 2 0 01-2-2V9"></path>
              </svg>
              <span>Mis Reservas</span>
            </a>
          }

          @if (authService.isAuthenticated() && authService.currentUser()?.tipo === 'admin') {
            <a routerLink="/admin" 
               routerLinkActive="bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-200"
               class="group flex items-center space-x-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-xl transition-all duration-200 font-medium">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Administración</span>
            </a>
          }
        </div>
      </div>
      
      <!-- Sección de Usuario -->
      <div class="flex items-center space-x-4">
        @if (authService.isAuthenticated()) {
          <!-- Saludo al Usuario -->
          <div class="hidden md:flex items-center space-x-3 bg-gray-50 rounded-xl px-4 py-2">
            <div class="w-8 h-8 bg-gradient-to-r from-primary-500 to-blue-500 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <span class="text-gray-700 font-medium">Hola, {{ authService.currentUser()?.nombre }}</span>
          </div>

          <!-- Botón de Perfil -->
          <a routerLink="/perfil" 
             class="flex items-center space-x-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-xl transition-all duration-200 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="hidden sm:inline">Perfil</span>
          </a>

          <!-- Botón Cerrar Sesión -->
          <button (click)="logout()" 
                  class="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-red-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="hidden sm:inline">Cerrar Sesión</span>
          </button>
        } @else {
          <!-- Botones de Autenticación -->
          <a routerLink="/auth/login" 
             class="flex items-center space-x-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            <span>Iniciar Sesión</span>
          </a>

          <a routerLink="/auth/register" 
             class="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-primary-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            <span>Registrarse</span>
          </a>
        }

        <!-- Menú Móvil (Hamburger) -->
        <button class="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
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
