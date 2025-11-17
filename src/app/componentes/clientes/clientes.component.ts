import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Cliente {
  id?: number;
  // Información Personal
  nombres: string;
  apellidos: string;
  tipoDocumento: string;
  numeroDocumento: string;
  fechaNacimiento: string;
  genero: string;

  // Información de Contacto
  email: string;
  telefono: string;
  telefonoAlternativo: string;

  // Dirección
  direccion: string;
  ciudad: string;
  pais: string;

  // Seguridad
  password: string;

  // Preferencias
  aceptaTerminos: boolean;
  recibirPromociones: boolean;

  // Metadata
  fechaRegistro?: Date;
  ultimoAcceso?: Date;
  estado?: string;
}

interface Credenciales {
  email: string;
  password: string;
}

@Component({
  selector: 'app-clientes.component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})

export class ClientesComponent implements OnInit {
  vistaActual: 'login' | 'registro' = 'registro';

  // Datos del cliente
  cliente: Cliente = {
    nombres: '',
    apellidos: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaNacimiento: '',
    genero: '',
    email: '',
    telefono: '',
    telefonoAlternativo: '',
    direccion: '',
    ciudad: '',
    pais: '',
    password: '',
    aceptaTerminos: false,
    recibirPromociones: false,
    estado: 'activo'
  };

  // Credenciales de login
  credenciales: Credenciales = {
    email: '',
    password: ''
  };

  // Confirmación de contraseña
  confirmarPassword: string = '';

  // Estados de password
  mostrarPassword: boolean = false;
  mostrarConfirmarPassword: boolean = false;
  mostrarPasswordLogin: boolean = false;
  nivelPassword: string = '';
  textoNivelPassword: string = '';

  // Estados generales
  procesando: boolean = false;
  mostrarExito: boolean = false;
  recordarme: boolean = false;

  // Fecha máxima (debe ser mayor de 18 años)
  fechaMaxima: string = '';

  ngOnInit(): void {
    this.calcularFechaMaxima();
  }

  calcularFechaMaxima(): void {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18); // Restar 18 años
    this.fechaMaxima = hoy.toISOString().split('T')[0];
  }

  // Cambiar vista
  cambiarVista(vista: 'login' | 'registro'): void {
    this.vistaActual = vista;
  }

  // Toggle password visibility
  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleConfirmarPassword(): void {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }

  togglePasswordLogin(): void {
    this.mostrarPasswordLogin = !this.mostrarPasswordLogin;
  }

  // Verificar fortaleza de contraseña
  verificarFortalezaPassword(): void {
    const password = this.cliente.password;
    let fuerza = 0;

    if (password.length >= 8) fuerza++;
    if (password.length >= 12) fuerza++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) fuerza++;
    if (/[0-9]/.test(password)) fuerza++;
    if (/[^a-zA-Z0-9]/.test(password)) fuerza++;

    if (fuerza <= 2) {
      this.nivelPassword = 'debil';
      this.textoNivelPassword = 'Débil';
    } else if (fuerza <= 4) {
      this.nivelPassword = 'media';
      this.textoNivelPassword = 'Media';
    } else {
      this.nivelPassword = 'fuerte';
      this.textoNivelPassword = 'Fuerte';
    }
  }

  // Watch password changes
  onPasswordChange(): void {
    this.verificarFortalezaPassword();
  }

  // Registrar Cliente
  registrarCliente(): void {
    if (!this.validarRegistro()) {
      return;
    }

    this.procesando = true;

    // Simular llamada a API
    setTimeout(() => {
      this.guardarClienteEnStorage();
      this.procesando = false;
      this.mostrarExito = true;
      this.enviarEmailBienvenida();
    }, 2000);
  }

  validarRegistro(): boolean {
    // Validar que las contraseñas coincidan
    if (this.cliente.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return false;
    }

    // Validar longitud de contraseña
    if (this.cliente.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    // Validar términos y condiciones
    if (!this.cliente.aceptaTerminos) {
      alert('Debes aceptar los términos y condiciones');
      return false;
    }

    // Validar email único
    if (this.emailYaRegistrado(this.cliente.email)) {
      alert('Este email ya está registrado. Por favor, inicia sesión.');
      return false;
    }

    // Validar documento único
    if (this.documentoYaRegistrado(this.cliente.numeroDocumento)) {
      alert('Este documento ya está registrado.');
      return false;
    }

    return true;
  }

  emailYaRegistrado(email: string): boolean {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      const clientes: Cliente[] = JSON.parse(clientesGuardados);
      return clientes.some(c => c.email.toLowerCase() === email.toLowerCase());
    }
    return false;
  }

  documentoYaRegistrado(documento: string): boolean {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      const clientes: Cliente[] = JSON.parse(clientesGuardados);
      return clientes.some(c => c.numeroDocumento === documento);
    }
    return false;
  }

  guardarClienteEnStorage(): void {
    // Obtener clientes existentes
    const clientesGuardados = localStorage.getItem('clientes');
    let clientes: Cliente[] = clientesGuardados ? JSON.parse(clientesGuardados) : [];

    // Generar ID
    const nuevoId = clientes.length > 0 
      ? Math.max(...clientes.map(c => c.id || 0)) + 1 
      : 1;

    // Agregar metadata
    this.cliente.id = nuevoId;
    this.cliente.fechaRegistro = new Date();
    this.cliente.ultimoAcceso = new Date();

    // Agregar nuevo cliente
    clientes.push(this.cliente);

    // Guardar en localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes));

    // Guardar sesión actual
    this.guardarSesion(this.cliente);

    console.log('Cliente registrado:', this.cliente);
  }

  // Iniciar Sesión
  iniciarSesion(): void {
    if (!this.validarLogin()) {
      return;
    }

    this.procesando = true;

    // Simular llamada a API
    setTimeout(() => {
      const cliente = this.autenticarCliente(this.credenciales.email, this.credenciales.password);
      
      if (cliente) {
        this.actualizarUltimoAcceso(cliente);
        this.guardarSesion(cliente);
        this.procesando = false;
        
        // Redirigir a destinos
        console.log('Login exitoso:', cliente);
        this.irADestinos();
      } else {
        this.procesando = false;
        alert('Email o contraseña incorrectos');
      }
    }, 1500);
  }

  validarLogin(): boolean {
    if (!this.credenciales.email || !this.credenciales.password) {
      alert('Por favor completa todos los campos');
      return false;
    }
    return true;
  }

  autenticarCliente(email: string, password: string): Cliente | null {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      const clientes: Cliente[] = JSON.parse(clientesGuardados);
      const cliente = clientes.find(
        c => c.email.toLowerCase() === email.toLowerCase() && c.password === password
      );
      return cliente || null;
    }
    return null;
  }

  actualizarUltimoAcceso(cliente: Cliente): void {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      const clientes: Cliente[] = JSON.parse(clientesGuardados);
      const index = clientes.findIndex(c => c.id === cliente.id);
      if (index !== -1) {
        clientes[index].ultimoAcceso = new Date();
        localStorage.setItem('clientes', JSON.stringify(clientes));
      }
    }
  }

  guardarSesion(cliente: Cliente): void {
    // Guardar sesión del usuario actual
    const sesion = {
      id: cliente.id,
      nombres: cliente.nombres,
      apellidos: cliente.apellidos,
      email: cliente.email,
      telefono: cliente.telefono,
      ciudad: cliente.ciudad,
      pais: cliente.pais,
      fechaLogin: new Date()
    };

    localStorage.setItem('sesionActual', JSON.stringify(sesion));

    if (this.recordarme) {
      localStorage.setItem('recordarme', 'true');
    }

    console.log('Sesión guardada:', sesion);
  }

  // Recuperar contraseña
  recuperarPassword(event: Event): void {
    event.preventDefault();
    const email = prompt('Ingresa tu correo electrónico:');
    
    if (email) {
      const clientesGuardados = localStorage.getItem('clientes');
      if (clientesGuardados) {
        const clientes: Cliente[] = JSON.parse(clientesGuardados);
        const cliente = clientes.find(c => c.email.toLowerCase() === email.toLowerCase());
        
        if (cliente) {
          alert(`Se ha enviado un correo de recuperación a ${email}`);
          console.log('Email de recuperación enviado a:', email);
          // Aquí deberías llamar a tu servicio de backend para enviar el email
        } else {
          alert('No se encontró ninguna cuenta con ese email');
        }
      }
    }
  }

  // Social Login
  loginConGoogle(): void {
    console.log('Login con Google');
    alert('Funcionalidad de Google no implementada. Usa el formulario.');
    // Aquí implementarías la integración con Google OAuth
  }

  loginConFacebook(): void {
    console.log('Login con Facebook');
    alert('Funcionalidad de Facebook no implementada. Usa el formulario.');
    // Aquí implementarías la integración con Facebook OAuth
  }

  registroConGoogle(): void {
    console.log('Registro con Google');
    alert('Funcionalidad de Google no implementada. Usa el formulario.');
  }

  registroConFacebook(): void {
    console.log('Registro con Facebook');
    alert('Funcionalidad de Facebook no implementada. Usa el formulario.');
  }

  // Mostrar documentos legales
  mostrarTerminos(event: Event): void {
    event.preventDefault();
    alert('Aquí se mostrarían los Términos y Condiciones');
    // Aquí deberías abrir un modal o navegar a una página de términos
  }

  mostrarPrivacidad(event: Event): void {
    event.preventDefault();
    alert('Aquí se mostraría la Política de Privacidad');
    // Aquí deberías abrir un modal o navegar a una página de privacidad
  }

  // Email de bienvenida
  enviarEmailBienvenida(): void {
    console.log('Enviando email de bienvenida a:', this.cliente.email);
    
    // Ejemplo de lo que enviarías al backend:
    const emailData = {
      to: this.cliente.email,
      subject: '¡Bienvenido a ViajesPlus!',
      template: 'bienvenida',
      data: {
        nombre: this.cliente.nombres,
        apellido: this.cliente.apellidos
      }
    };

    // this.emailService.enviarEmail(emailData).subscribe(...);
  }

  // Navegación
  cerrarExito(): void {
    this.mostrarExito = false;
    this.irADestinos();
  }

  irADestinos(): void {
    console.log('Navegando a destinos...');
    // Aquí deberías usar el Router de Angular
    // this.router.navigate(['/destinos']);
  }

  // Método para verificar si hay sesión activa
  static verificarSesion(): boolean {
    const sesion = localStorage.getItem('sesionActual');
    return sesion !== null;
  }

  // Método para obtener datos del usuario logueado
  static obtenerUsuarioActual(): any {
    const sesion = localStorage.getItem('sesionActual');
    return sesion ? JSON.parse(sesion) : null;
  }

  // Método para cerrar sesión
  static cerrarSesion(): void {
    localStorage.removeItem('sesionActual');
    localStorage.removeItem('recordarme');
    console.log('Sesión cerrada');
  }
}
