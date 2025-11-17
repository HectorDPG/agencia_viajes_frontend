import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {
  rutaActiva: string = 'inicio';
  nombreUsuario: string = 'Usuario';
  inicialUsuario: string = 'U';
  cantidadFavoritos: number = 3;
  cantidadCarrito: number = 2;
  menuUsuarioAbierto: boolean = false;
  menuMovilAbierto: boolean = false;
  busquedaAbierta: boolean = false;
  terminoBusqueda: string = '';

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.detectarRutaActiva();
  }

  cargarDatosUsuario(): void {
    const usuario = this.obtenerUsuarioActual();
    if (usuario) {
      this.nombreUsuario = usuario.nombre;
      this.inicialUsuario = usuario.nombre.charAt(0).toUpperCase();
    }
  }

  obtenerUsuarioActual(): any {
    return {
      nombre: 'Hector',
      email: 'hector@example.com',
      avatar: null
    };
  }

  detectarRutaActiva(): void {
  }

  navegarA(ruta: string): void {
    this.rutaActiva = ruta;
    this.cerrarMenus();
    console.log(`Navegando a: ${ruta}`);
  }

  toggleMenuUsuario(): void {
    this.menuUsuarioAbierto = !this.menuUsuarioAbierto;
    if (this.menuUsuarioAbierto) {
      this.menuMovilAbierto = false;
      this.busquedaAbierta = false;
    }
  }

  toggleMenuMovil(): void {
    this.menuMovilAbierto = !this.menuMovilAbierto;
    if (this.menuMovilAbierto) {
      this.menuUsuarioAbierto = false;
      this.busquedaAbierta = false;
    }
    if (this.menuMovilAbierto) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  toggleBusqueda(): void {
    this.busquedaAbierta = !this.busquedaAbierta;
    if (this.busquedaAbierta) {
      this.menuUsuarioAbierto = false;
      this.menuMovilAbierto = false;
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      this.terminoBusqueda = '';
    }
  }

  cerrarMenus(): void {
    this.menuUsuarioAbierto = false;
    this.menuMovilAbierto = false;
    this.busquedaAbierta = false;
    document.body.style.overflow = '';
  }

  buscar(): void {
    if (this.terminoBusqueda.trim()) {
      console.log(`Buscando: ${this.terminoBusqueda}`);
      this.toggleBusqueda();
    }
  }

  abrirFavoritos(): void {
    console.log('Abriendo favoritos');
    this.navegarA('favoritos');
  }

  abrirCarrito(): void {
    console.log('Abriendo carrito');
    this.navegarA('carrito');
  }

  cerrarSesion(): void {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      console.log('Cerrando sesión...');
      this.cerrarMenus();
      alert('Sesión cerrada exitosamente');
      this.navegarA('login');
    }
  }
  
  actualizarContadores(favoritos: number, carrito: number): void {
    this.cantidadFavoritos = favoritos;
    this.cantidadCarrito = carrito;
  }

  actualizarUsuario(nombre: string): void {
    this.nombreUsuario = nombre;
    this.inicialUsuario = nombre.charAt(0).toUpperCase();
  }

}