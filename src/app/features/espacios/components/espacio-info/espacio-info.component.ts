import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { Espacio } from "../../../../core/models/espacio.model"

@Component({
  selector: "app-espacio-info",
  standalone: true,
  imports: [CommonModule],
  templateUrl:  "./espacio-info.component.html",
})
export class EspacioInfoComponent {
  @Input({ required: true }) espacio!: Espacio
}
