import type { Routes } from "@angular/router"

export const adminRoutes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "dashboard",
    loadComponent: () =>
      import("./pages/dashboard/admin-dashboard.component").then((m) => m.DashboardComponent),
  },
  {
    path: "espacios",
    loadComponent: () =>
      import("./pages/espacios/admin-espacios.component").then((m) => m.EspaciosComponent),
  },
  {
    path: "usuarios",
    loadComponent: () =>
      import("./pages/usuarios/admin-usuarios.component").then((m) => m.AdminUsuariosComponent),
  },
  {
    path: "reservas",
    loadComponent: () =>
      import("./pages/reservas/admin-reservas.component").then((m) => m.AdminReservasComponent),
  },
]
