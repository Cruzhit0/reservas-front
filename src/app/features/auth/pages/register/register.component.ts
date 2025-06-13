import { Component, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../../core/services/auth.service"

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  loading = signal(false)
  error = signal<string | null>(null)

  registerForm = this.fb.group({
    nombre: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]],
  })

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading.set(true)
      this.error.set(null)

      const registerData = {
        ...this.registerForm.value,
        tipo: "usuario" as const,
      }

      this.authService.register(registerData as any).subscribe({
        next: () => {
          this.router.navigate(["/login"])
        },
        error: (err) => {
          this.error.set("Error al registrar usuario")
          this.loading.set(false)
        },
      })
    }
  }
}
