import type { Routes } from "@angular/router"

export const espaciosRoutes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/espacio-list/espacio-list.component").then((m) => m.EspaciosListComponent),
  },
  {
    path: ":id",
    loadComponent: () =>
      import("./pages/espacio-detail/espacio-detail.component").then((m) => m.EspacioDetailComponent),
  },
]
