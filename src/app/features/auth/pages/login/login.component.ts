import { Component, inject, signal } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { AuthService } from "../../../../core/services/auth.service"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private fb = inject(FormBuilder)
  private authService = inject(AuthService)
  private router = inject(Router)

  loading = signal(false)
  error = signal<string | null>(null)

  loginForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required],
  })

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading.set(true)
      this.error.set(null)

      this.authService.login(this.loginForm.value as any).subscribe({
        next: () => {
          this.router.navigate(["/espacios"])
        },
        error: (err) => {
          this.error.set("Credenciales inválidas")
          this.loading.set(false)
        },
      })
    }
  }
}
