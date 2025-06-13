import { Component, inject, signal, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { UsuariosService } from "../../../../core/services/usuario.service"
import type { User } from "../../../../core/models/user.model"

@Component({
  selector: "app-admin-usuarios",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./admin-usuarios.component.html",
})
export class AdminUsuariosComponent implements OnInit {
  private usuariosService = inject(UsuariosService)

  usuarios = signal<User[]>([])
  loading = signal(false)
  error = signal<string | null>(null)

  ngOnInit(): void {
    this.loadUsuarios()
  }

  private loadUsuarios(): void {
    this.loading.set(true)
    this.error.set(null)

    this.usuariosService.getAllUsers().subscribe({
      next: (usuarios) => {
        this.usuarios.set(usuarios)
        this.loading.set(false)
      },
      error: (err) => {
        this.error.set("Error al cargar los usuarios")
        this.loading.set(false)
      },
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
