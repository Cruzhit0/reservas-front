import type { Routes } from "@angular/router"

export const reservasRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/mis-reservas/mis-reservas.component").then((m) => m.MisReservasComponent),
  },
]
