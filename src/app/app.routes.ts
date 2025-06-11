import type { Routes } from "@angular/router"

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
    path: "**",
    redirectTo: "/espacios",
  },
]
