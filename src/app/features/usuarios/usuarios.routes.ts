import type { Routes } from "@angular/router"

export const usuariosRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/perfil/perfil.component").then((m) => m.PerfilComponent),
  },
]
