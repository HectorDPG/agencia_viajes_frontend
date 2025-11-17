import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Destino {
  id: number;
  nombre: string;
  ubicacion: string;
  region: string;
  tipo: string;
  descripcion: string;
  descripcionCompleta: string;
  imagen: string;
  precio: string;
  precioNumerico: number;
  rating: number;
  duracion: string;
  caracteristicas: string[];
  incluye: string[];
  popular: boolean;
  presupuesto: string;
}

interface Reserva {
  // Información Personal
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;

  // Detalles del Viaje
  fechaSalida: string;
  fechaRegreso: string;
  numeroPersonas: number;
  tipoHabitacion: string;

  // Servicios Adicionales
  servicios: {
    seguroViaje: boolean;
    trasladoAeropuerto: boolean;
    guiaTuristico: boolean;
    toursAdicionales: boolean;
  };

  // Observaciones
  observaciones: string;

  // Datos del destino
  destinoId: number;
  destinoNombre: string;
  destinoUbicacion: string;

  // Información de la reserva
  precioTotal: number;
  estado: string;
  fechaReserva: Date;
  codigoReserva: string;
}

@Component({
  selector: 'app-reserva.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva.component.html',
  styleUrl: './reserva.component.css',
})

export class ReservaComponent implements OnInit {
  
  @Input() destinoSeleccionado: Destino | null = null;

  reserva: Reserva = {
    nombres: '',
    apellidos: '',
    email: '',
    telefono: '',
    tipoDocumento: '',
    numeroDocumento: '',
    fechaSalida: '',
    fechaRegreso: '',
    numeroPersonas: 1,
    tipoHabitacion: '',
    servicios: {
      seguroViaje: false,
      trasladoAeropuerto: false,
      guiaTuristico: false,
      toursAdicionales: false
    },
    observaciones: '',
    destinoId: 0,
    destinoNombre: '',
    destinoUbicacion: '',
    precioTotal: 0,
    estado: 'pendiente',
    fechaReserva: new Date(),
    codigoReserva: ''
  };

  // Precios
  precioBase: number = 0;
  precioTotal: number = 0;
  costoServicios: number = 0;

  // Precios de servicios adicionales
  readonly PRECIOS_SERVICIOS = {
    seguroViaje: 50,
    trasladoAeropuerto: 80,
    guiaTuristico: 120,
    toursAdicionales: 200
  };

  // Multiplicadores por tipo de habitación
  readonly MULTIPLICADORES_HABITACION = {
    simple: 1,
    doble: 1.3,
    triple: 1.5,
    suite: 2
  };

  // Estados
  procesando: boolean = false;
  mostrarConfirmacion: boolean = false;
  codigoReserva: string = '';

  // Fecha mínima (hoy)
  fechaMinima: string = '';

  ngOnInit(): void {
    this.inicializarComponente();
  }

  inicializarComponente(): void {
    // Establecer fecha mínima (hoy)
    const hoy = new Date();
    this.fechaMinima = hoy.toISOString().split('T')[0];

    // Si no hay destino seleccionado, cargar uno de ejemplo o redirigir
    if (!this.destinoSeleccionado) {
      this.cargarDestinoEjemplo();
    } else {
      this.cargarDatosDestino();
    }

    // Cargar datos del usuario si están disponibles
    this.cargarDatosUsuario();
  }

  cargarDestinoEjemplo(): void {
    // Destino de ejemplo para pruebas
    this.destinoSeleccionado = {
      id: 1,
      nombre: 'París, Francia',
      ubicacion: 'Francia, Europa',
      region: 'europa',
      tipo: 'cultural',
      descripcion: 'La ciudad del amor te espera',
      descripcionCompleta: 'París, la capital de Francia...',
      imagen: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      precio: 'Desde $1,299',
      precioNumerico: 1299,
      rating: 4.9,
      duracion: '7 días / 6 noches',
      caracteristicas: ['Torre Eiffel', 'Louvre', 'Crucero Sena'],
      incluye: ['Vuelo', 'Hotel', 'Tours'],
      popular: true,
      presupuesto: 'alto'
    };
    this.cargarDatosDestino();
  }

  cargarDatosDestino(): void {
    if (this.destinoSeleccionado) {
      this.precioBase = this.destinoSeleccionado.precioNumerico;
      this.reserva.destinoId = this.destinoSeleccionado.id;
      this.reserva.destinoNombre = this.destinoSeleccionado.nombre;
      this.reserva.destinoUbicacion = this.destinoSeleccionado.ubicacion;
      this.calcularPrecioTotal();
    }
  }

  cargarDatosUsuario(): void {
    // Aquí podrías cargar datos del usuario desde localStorage o un servicio
    // Por ejemplo, autocompletar el email si el usuario está logueado
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
      this.reserva.nombres = usuario.nombres || '';
      this.reserva.apellidos = usuario.apellidos || '';
      this.reserva.email = usuario.email || '';
      this.reserva.telefono = usuario.telefono || '';
    }
  }

  // Cálculos
  calcularPrecioTotal(): void {
    let total = this.precioBase;

    // Multiplicar por número de personas
    total *= this.reserva.numeroPersonas;

    // Aplicar multiplicador de habitación
    if (this.reserva.tipoHabitacion && this.MULTIPLICADORES_HABITACION[this.reserva.tipoHabitacion as keyof typeof this.MULTIPLICADORES_HABITACION]) {
      total *= this.MULTIPLICADORES_HABITACION[this.reserva.tipoHabitacion as keyof typeof this.MULTIPLICADORES_HABITACION];
    }

    // Calcular costo de servicios adicionales
    this.costoServicios = 0;
    if (this.reserva.servicios.seguroViaje) {
      this.costoServicios += this.PRECIOS_SERVICIOS.seguroViaje * this.reserva.numeroPersonas;
    }
    if (this.reserva.servicios.trasladoAeropuerto) {
      this.costoServicios += this.PRECIOS_SERVICIOS.trasladoAeropuerto;
    }
    if (this.reserva.servicios.guiaTuristico) {
      this.costoServicios += this.PRECIOS_SERVICIOS.guiaTuristico;
    }
    if (this.reserva.servicios.toursAdicionales) {
      this.costoServicios += this.PRECIOS_SERVICIOS.toursAdicionales;
    }

    total += this.costoServicios;

    this.precioTotal = total;
    this.reserva.precioTotal = total;
  }

  calcularFechaRegreso(): void {
    if (this.reserva.fechaSalida && this.destinoSeleccionado) {
      // Extraer días de la duración (por ejemplo: "7 días / 6 noches")
      const duracion = this.destinoSeleccionado.duracion;
      const dias = parseInt(duracion.match(/(\d+)\s*días?/)?.[1] || '7');

      const fechaSalida = new Date(this.reserva.fechaSalida);
      const fechaRegreso = new Date(fechaSalida);
      fechaRegreso.setDate(fechaRegreso.getDate() + dias);

      this.reserva.fechaRegreso = fechaRegreso.toISOString().split('T')[0];
    }
  }

  // Contador de personas
  incrementarPersonas(): void {
    if (this.reserva.numeroPersonas < 10) {
      this.reserva.numeroPersonas++;
      this.calcularPrecioTotal();
    }
  }

  decrementarPersonas(): void {
    if (this.reserva.numeroPersonas > 1) {
      this.reserva.numeroPersonas--;
      this.calcularPrecioTotal();
    }
  }

  // Guardar Reserva
  guardarReserva(): void {
    if (this.validarFormulario()) {
      this.procesando = true;

      // Generar código de reserva único
      this.codigoReserva = this.generarCodigoReserva();
      this.reserva.codigoReserva = this.codigoReserva;
      this.reserva.fechaReserva = new Date();

      // Simular llamada a API
      setTimeout(() => {
        this.guardarEnLocalStorage();
        this.enviarConfirmacionEmail();
        this.procesando = false;
        this.mostrarConfirmacion = true;
      }, 2000);
    }
  }

  validarFormulario(): boolean {
    // Validación básica (el formulario de Angular ya hace validación)
    if (!this.reserva.nombres || !this.reserva.apellidos || !this.reserva.email) {
      alert('Por favor completa todos los campos obligatorios');
      return false;
    }

    if (!this.reserva.fechaSalida) {
      alert('Por favor selecciona una fecha de salida');
      return false;
    }

    if (!this.reserva.tipoHabitacion) {
      alert('Por favor selecciona un tipo de habitación');
      return false;
    }

    return true;
  }

  generarCodigoReserva(): string {
    const fecha = new Date();
    const timestamp = fecha.getTime().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `RES-${timestamp}-${random}`;
  }

  guardarEnLocalStorage(): void {
    // Obtener reservas existentes
    const reservasGuardadas = localStorage.getItem('reservas');
    let reservas: Reserva[] = reservasGuardadas ? JSON.parse(reservasGuardadas) : [];

    // Agregar nueva reserva
    reservas.push(this.reserva);

    // Guardar en localStorage
    localStorage.setItem('reservas', JSON.stringify(reservas));

    console.log('Reserva guardada:', this.reserva);
  }

  enviarConfirmacionEmail(): void {
    // Aquí deberías llamar a tu servicio de backend para enviar el email
    console.log('Enviando email de confirmación a:', this.reserva.email);
    
    // Ejemplo de lo que enviarías al backend:
    const emailData = {
      to: this.reserva.email,
      subject: `Confirmación de Reserva - ${this.codigoReserva}`,
      template: 'confirmacion-reserva',
      data: {
        codigoReserva: this.codigoReserva,
        nombreCliente: `${this.reserva.nombres} ${this.reserva.apellidos}`,
        destino: this.reserva.destinoNombre,
        fechaSalida: this.reserva.fechaSalida,
        fechaRegreso: this.reserva.fechaRegreso,
        numeroPersonas: this.reserva.numeroPersonas,
        precioTotal: this.precioTotal
      }
    };

    // this.emailService.enviarEmail(emailData).subscribe(...);
  }

  // Navegación
  volver(): void {
    if (confirm('¿Estás seguro de que deseas cancelar la reserva?')) {
      // Aquí deberías usar el Router para navegar
      console.log('Volviendo a destinos...');
      // this.router.navigate(['/destinos']);
    }
  }

  cancelar(): void {
    this.volver();
  }

  cerrarConfirmacion(): void {
    this.mostrarConfirmacion = false;
    this.limpiarFormulario();
    // Redirigir a la página principal o lista de destinos
    // this.router.navigate(['/destinos']);
  }

  irAMisReservas(): void {
    this.mostrarConfirmacion = false;
    console.log('Navegando a Mis Reservas...');
    // this.router.navigate(['/mis-reservas']);
  }

  limpiarFormulario(): void {
    this.reserva = {
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      tipoDocumento: '',
      numeroDocumento: '',
      fechaSalida: '',
      fechaRegreso: '',
      numeroPersonas: 1,
      tipoHabitacion: '',
      servicios: {
        seguroViaje: false,
        trasladoAeropuerto: false,
        guiaTuristico: false,
        toursAdicionales: false
      },
      observaciones: '',
      destinoId: 0,
      destinoNombre: '',
      destinoUbicacion: '',
      precioTotal: 0,
      estado: 'pendiente',
      fechaReserva: new Date(),
      codigoReserva: ''
    };
  }

  // Método para uso externo
  setDestino(destino: Destino): void {
    this.destinoSeleccionado = destino;
    this.cargarDatosDestino();
  }
}

