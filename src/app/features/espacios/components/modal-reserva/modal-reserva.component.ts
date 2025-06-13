import { Component, EventEmitter, Input, type OnChanges, Output, type SimpleChanges, signal } from "@angular/core"
import { CommonModule, DatePipe } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"

export interface HorarioDisponible {
  hora: string
  disponible: boolean
  razon?: string
}

export interface ReservaFormData {
  fecha: Date
  hora_inicio: string
  duracion: number
}

export interface ConfirmacionReserva {
  duracion: number
}


@Component({
  selector: "app-modal-reserva",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: "./modal-reserva.component.html", 
})
export class ModalReservaComponent {
  @Input() fecha!: Date
  @Input() hora!: number
  @Input() loading = false
  @Input() error: string | null = null
  @Input() success = false

  @Output() cerrar = new EventEmitter<void>()
  @Output() confirmar = new EventEmitter<ConfirmacionReserva>()

  reservaForm = this.fb.group({
    duracion: [1, Validators.required],
  })

  constructor(private fb: FormBuilder) {}

  cerrarModal(event: Event): void {
    if (event.target === event.currentTarget) {
      this.cerrar.emit()
    }
  }

  onSubmit(): void {
    if (this.reservaForm.valid) {
      this.confirmar.emit({
        duracion: Number(this.reservaForm.value.duracion),
      })
    }
  }
}
