import type { Routes } from "@angular/router"
import { authGuard } from "./core/guards/auth.guard"

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/espacios",
    pathMatch: "full",
  },
  {
    path: "auth",
    loadChildren: () => import("./features/auth/auth.routes").then((m) => m.authRoutes),
  },
  {
    path: "espacios",
    loadChildren: () => import("./features/espacios/espacios.routes").then((m) => m.espaciosRoutes),
  },
  {
    path: "perfil",
    loadChildren: () => import("./features/usuarios/usuarios.routes").then((m) => m.usuariosRoutes),
    canActivate: [authGuard],
  },
   {
    path: "reservas",
    loadChildren: () => import("./features/reservas/reservas.routes").then((m) => m.reservasRoutes),
    canActivate: [authGuard],
  },
   {
    path: "admin",
    loadChildren: () => import("./features/admin/admin.routes").then((m) => m.adminRoutes),
    canActivate: [authGuard],
  },
  {
    path: "**",
    redirectTo: "/espacios",
  },
]
