import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loading: boolean = false; // ✅ Agregar estado de carga

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    // ✅ Si ya está autenticado, redirigir al home
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/');
    }
  }

  login() {
    // Validación de campos vacíos
    if (!this.email || !this.password) {
      this.toastr.warning('Por favor completa todos los campos', 'Campos vacíos');
      return;
    }

    // Validación de email
    if (!this.isValidEmail(this.email)) {
      this.toastr.warning('Por favor ingresa un email válido', 'Email inválido');
      return;
    }

    // Validación de contraseña
    if (this.password.length < 6) {
      this.toastr.warning('La contraseña debe tener al menos 6 caracteres', 'Contraseña inválida');
      return;
    }

    // ✅ Indicar que está cargando
    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (resp: any) => {
        this.loading = false;
        
        if (resp && resp.access_token) {
          this.toastr.success('¡Bienvenido!', 'Inicio de sesión exitoso');
          
          // ✅ Solo navegar, SIN recargar la página
          this.router.navigateByUrl('/');
        } else {
          this.toastr.error('Respuesta inválida del servidor', 'Error');
        }
      },
      error: (error) => {
        this.loading = false;
        
        console.error("Error de login:", error);
        
        const status = error.status || error.error?.status;
        const message = error.error?.message || error.message;

        // Manejo específico de errores
        if (status === 401 || message?.toLowerCase().includes('unauthorized') || 
            message?.toLowerCase().includes('credenciales')) {
          this.toastr.error('Email o contraseña incorrectos', 'Error de autenticación');
        } else if (status === 404) {
          this.toastr.error('Usuario no encontrado', 'Error');
        } else if (status === 0 || !status) {
          this.toastr.error('No se pudo conectar con el servidor', 'Error de conexión');
        } else if (status === 400) {
          this.toastr.error('Datos inválidos', 'Error de validación');
        } else if (status >= 500) {
          this.toastr.error('Error en el servidor. Intenta más tarde', 'Error del servidor');
        } else {
          this.toastr.error(message || 'Por favor intenta nuevamente', 'Error al iniciar sesión');
        }
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }
}