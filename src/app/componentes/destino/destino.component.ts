import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-destino',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './destino.component.html',
  styleUrls: ['./destino.component.css'],
})

export class DestinoComponent implements OnInit {
  destinos: Destino[] = [];
  destinosFiltrados: Destino[] = [];
  destinoSeleccionado: Destino | null = null;

  // Filtros
  filtroRegion: string = '';
  filtroTipo: string = '';
  filtroPresupuesto: string = '';

  ngOnInit(): void {
    this.cargarDestinos();
    this.destinosFiltrados = this.destinos;
  }

  cargarDestinos(): void {
    this.destinos = [
      {
        id: 1,
        nombre: 'París, Francia',
        ubicacion: 'Francia, Europa',
        region: 'europa',
        tipo: 'cultural',
        descripcion: 'La ciudad del amor te espera con su arquitectura icónica, museos de clase mundial y gastronomía exquisita.',
        descripcionCompleta: 'París, la capital de Francia, es una de las ciudades más románticas y visitadas del mundo. Conocida por su impresionante arquitectura, desde la Torre Eiffel hasta la Catedral de Notre-Dame, París ofrece una experiencia cultural incomparable. Pasea por los Campos Elíseos, visita el Museo del Louvre, disfruta de la cocina francesa en sus bistros y cafés, y déjate llevar por el encanto de Montmartre.',
        imagen: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
        precio: 'Desde $1,299',
        precioNumerico: 1299,
        rating: 4.9,
        duracion: '7 días / 6 noches',
        caracteristicas: ['Torre Eiffel', 'Louvre', 'Crucero Sena'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel 4 estrellas con desayuno',
          'Tour guiado por la ciudad',
          'Entrada al Museo del Louvre',
          'Crucero por el río Sena',
          'Seguro de viaje'
        ],
        popular: true,
        presupuesto: 'alto'
      },
      {
        id: 2,
        nombre: 'Bali, Indonesia',
        ubicacion: 'Indonesia, Asia',
        region: 'asia',
        tipo: 'playa',
        descripcion: 'Paraíso tropical con playas de ensueño, templos sagrados y una cultura vibrante que te dejará sin aliento.',
        descripcionCompleta: 'Bali es una isla paradisíaca en Indonesia que combina playas vírgenes, arrozales en terrazas, templos milenarios y una rica cultura balinesa. Desde surfear en Uluwatu hasta explorar los templos de Ubud, Bali ofrece experiencias únicas. Relájate en sus spas, prueba la deliciosa comida local y sumérgete en la espiritualidad de la isla.',
        imagen: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
        precio: 'Desde $1,499',
        precioNumerico: 1499,
        rating: 4.8,
        duracion: '10 días / 9 noches',
        caracteristicas: ['Playas', 'Templos', 'Spa'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel resort con desayuno',
          'Tour por Ubud y arrozales',
          'Clase de surf',
          'Sesión de spa balinés',
          'Traslados aeropuerto-hotel',
          'Seguro de viaje'
        ],
        popular: true,
        presupuesto: 'medio'
      },
      {
        id: 3,
        nombre: 'Machu Picchu, Perú',
        ubicacion: 'Cusco, Perú',
        region: 'america',
        tipo: 'aventura',
        descripcion: 'Descubre la misteriosa ciudad inca en las alturas de los Andes peruanos, una maravilla del mundo.',
        descripcionCompleta: 'Machu Picchu es uno de los destinos más emblemáticos de Sudamérica. Esta antigua ciudad inca, situada a 2,430 metros sobre el nivel del mar, ofrece vistas espectaculares y una conexión única con la historia. Explora el Valle Sagrado, visita Cusco, la antigua capital del imperio inca, y camina por el famoso Camino Inca para llegar a esta maravilla arquitectónica.',
        imagen: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
        precio: 'Desde $899',
        precioNumerico: 899,
        rating: 4.9,
        duracion: '6 días / 5 noches',
        caracteristicas: ['Ruinas Incas', 'Trekking', 'Historia'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel en Cusco y Aguas Calientes',
          'Entrada a Machu Picchu',
          'Guía experto en historia inca',
          'Tren panorámico a Aguas Calientes',
          'Tour Valle Sagrado',
          'Seguro de viaje'
        ],
        popular: false,
        presupuesto: 'medio'
      },
      {
        id: 4,
        nombre: 'Tokio, Japón',
        ubicacion: 'Japón, Asia',
        region: 'asia',
        tipo: 'ciudad',
        descripcion: 'Metrópolis futurista donde la tradición milenaria se fusiona con la tecnología de vanguardia.',
        descripcionCompleta: 'Tokio es una ciudad fascinante que combina lo ultramoderno con lo tradicional. Desde los rascacielos de Shinjuku hasta los templos serenos de Asakusa, Tokio ofrece experiencias únicas. Disfruta de la gastronomía japonesa, explora el mercado de Tsukiji, visita el Palacio Imperial y sumérgete en la cultura pop en Akihabara y Harajuku.',
        imagen: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
        precio: 'Desde $1,799',
        precioNumerico: 1799,
        rating: 4.7,
        duracion: '8 días / 7 noches',
        caracteristicas: ['Tecnología', 'Cultura', 'Gastronomía'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel céntrico con desayuno',
          'JR Pass para 7 días',
          'Tour por Tokio con guía español',
          'Excursión al Monte Fuji',
          'Experiencia de ceremonia del té',
          'Seguro de viaje'
        ],
        popular: true,
        presupuesto: 'alto'
      },
      {
        id: 5,
        nombre: 'Santorini, Grecia',
        ubicacion: 'Grecia, Europa',
        region: 'europa',
        tipo: 'playa',
        descripcion: 'Isla volcánica con casas blancas, cúpulas azules y atardeceres que quitan el aliento sobre el Mar Egeo.',
        descripcionCompleta: 'Santorini es una de las islas más fotogénicas del mundo. Famosa por sus pueblos de casas blancas con cúpulas azules en Oia y Fira, ofrece vistas impresionantes al mar. Disfruta de sus playas de arena negra, degusta vinos locales en viñedos tradicionales, explora ruinas antiguas y vive atardeceres inolvidables.',
        imagen: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
        precio: 'Desde $1,399',
        precioNumerico: 1399,
        rating: 4.9,
        duracion: '7 días / 6 noches',
        caracteristicas: ['Playas', 'Vino', 'Romance'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel boutique con vista al mar',
          'Tour por la isla',
          'Cata de vinos en viñedos',
          'Paseo en catamarán al atardecer',
          'Visita a pueblo de Oia',
          'Seguro de viaje'
        ],
        popular: false,
        presupuesto: 'alto'
      },
      {
        id: 6,
        nombre: 'Cartagena, Colombia',
        ubicacion: 'Colombia, América del Sur',
        region: 'america',
        tipo: 'cultural',
        descripcion: 'Ciudad amurallada llena de color, historia colonial y las mejores playas del Caribe colombiano.',
        descripcionCompleta: 'Cartagena de Indias es una joya colonial del Caribe colombiano. Su ciudad amurallada, declarada Patrimonio de la Humanidad, alberga calles empedradas, balcones floridos y arquitectura colonial española. Disfruta de su gastronomía caribeña, relájate en las Islas del Rosario y vive la vibrante vida nocturna en Getsemaní.',
        imagen: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&q=80',
        precio: 'Desde $699',
        precioNumerico: 699,
        rating: 4.6,
        duracion: '5 días / 4 noches',
        caracteristicas: ['Colonial', 'Playa', 'Gastronomía'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel en ciudad amurallada',
          'Tour histórico a pie',
          'Excursión Islas del Rosario',
          'Cena típica colombiana',
          'Traslados incluidos',
          'Seguro de viaje'
        ],
        popular: false,
        presupuesto: 'bajo'
      },
      {
        id: 7,
        nombre: 'Queenstown, Nueva Zelanda',
        ubicacion: 'Nueva Zelanda, Oceanía',
        region: 'oceania',
        tipo: 'aventura',
        descripcion: 'Capital mundial de la aventura rodeada de montañas, lagos cristalinos y paisajes de película.',
        descripcionCompleta: 'Queenstown es el destino perfecto para los amantes de la adrenalina. Ubicada en la Isla Sur de Nueva Zelanda, ofrece actividades como bungy jumping, paracaidismo, rafting y esquí. También puedes disfrutar de la tranquilidad de sus lagos, visitar viñedos locales y explorar los escenarios de la trilogía de El Señor de los Anillos.',
        imagen: 'https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800&q=80',
        precio: 'Desde $2,199',
        precioNumerico: 2199,
        rating: 4.8,
        duracion: '10 días / 9 noches',
        caracteristicas: ['Deportes extremos', 'Naturaleza', 'Montañas'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel con vista al lago',
          'Actividades de aventura (bungy, paracaidismo)',
          'Tour Milford Sound',
          'Excursión a Glenorchy',
          'Alquiler de coche 4x4',
          'Seguro de viaje premium'
        ],
        popular: false,
        presupuesto: 'alto'
      },
      {
        id: 8,
        nombre: 'Marrakech, Marruecos',
        ubicacion: 'Marruecos, África',
        region: 'africa',
        tipo: 'cultural',
        descripcion: 'Ciudad imperial con zocos coloridos, palacios exóticos y la magia del desierto del Sahara.',
        descripcionCompleta: 'Marrakech te transporta a un mundo de colores, aromas y sonidos únicos. Explora la plaza Jemaa el-Fna, piérdete en los zocos laberínticos, visita palacios como el Bahía y los jardines Majorelle. Disfruta de la cocina marroquí, relájate en un hammam tradicional y vive la experiencia del desierto con una noche en un campamento bereber.',
        imagen: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&q=80',
        precio: 'Desde $899',
        precioNumerico: 899,
        rating: 4.5,
        duracion: '7 días / 6 noches',
        caracteristicas: ['Zocos', 'Desierto', 'Palacios'],
        incluye: [
          'Vuelo ida y vuelta',
          'Riad tradicional con desayuno',
          'Tour por Marrakech',
          'Excursión al desierto del Sahara (2 días)',
          'Noche en campamento bereber',
          'Paseo en camello',
          'Seguro de viaje'
        ],
        popular: false,
        presupuesto: 'medio'
      },
      {
        id: 9,
        nombre: 'Islas Maldivas',
        ubicacion: 'Maldivas, Océano Índico',
        region: 'asia',
        tipo: 'playa',
        descripcion: 'Paraíso tropical de aguas turquesas, villas sobre el agua y arrecifes de coral espectaculares.',
        descripcionCompleta: 'Las Maldivas representan el lujo tropical en su máxima expresión. Este archipiélago de 26 atolones ofrece playas de arena blanca, aguas cristalinas y una vida marina incomparable. Alójate en villas sobre el agua, practica snorkel o buceo en arrecifes de coral, disfruta de spas de clase mundial y vive una luna de miel perfecta.',
        imagen: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
        precio: 'Desde $2,999',
        precioNumerico: 2999,
        rating: 5.0,
        duracion: '7 días / 6 noches',
        caracteristicas: ['Lujo', 'Buceo', 'Romance'],
        incluye: [
          'Vuelo ida y vuelta',
          'Villa sobre el agua todo incluido',
          'Traslado en hidroavión',
          'Actividades acuáticas ilimitadas',
          'Spa con tratamientos incluidos',
          'Cena romántica en la playa',
          'Seguro de viaje'
        ],
        popular: true,
        presupuesto: 'alto'
      },
      {
        id: 10,
        nombre: 'Patagonia, Argentina',
        ubicacion: 'Argentina, América del Sur',
        region: 'america',
        tipo: 'naturaleza',
        descripcion: 'Tierra salvaje de glaciares imponentes, montañas majestuosas y paisajes que desafían la imaginación.',
        descripcionCompleta: 'La Patagonia argentina es un destino para los amantes de la naturaleza en estado puro. Explora el Glaciar Perito Moreno, camina por el Parque Nacional Los Glaciares, descubre el Chaltén (capital del trekking), y admira la fauna silvestre en Península Valdés. Es un viaje que combina aventura, naturaleza y paisajes únicos en el mundo.',
        imagen: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
        precio: 'Desde $1,599',
        precioNumerico: 1599,
        rating: 4.8,
        duracion: '9 días / 8 noches',
        caracteristicas: ['Glaciares', 'Trekking', 'Fauna'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hoteles y lodges',
          'Visita al Glaciar Perito Moreno',
          'Trekking en El Chaltén',
          'Tour Península Valdés',
          'Todas las excursiones',
          'Seguro de viaje'
        ],
        popular: false,
        presupuesto: 'medio'
      },
      {
        id: 11,
        nombre: 'Praga, República Checa',
        ubicacion: 'República Checa, Europa',
        region: 'europa',
        tipo: 'ciudad',
        descripcion: 'Ciudad de cuento de hadas con castillos medievales, puentes históricos y cerveza de calidad mundial.',
        descripcionCompleta: 'Praga es una de las ciudades más hermosas de Europa, con una arquitectura que abarca desde el gótico hasta el art nouveau. Visita el Castillo de Praga, cruza el icónico Puente de Carlos, explora la Ciudad Vieja y su famoso reloj astronómico, y disfruta de la mejor cerveza checa en sus tradicionales cervecerías.',
        imagen: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80',
        precio: 'Desde $799',
        precioNumerico: 799,
        rating: 4.7,
        duracion: '5 días / 4 noches',
        caracteristicas: ['Medieval', 'Castillos', 'Cerveza'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel céntrico con desayuno',
          'Tour por Praga',
          'Entrada al Castillo de Praga',
          'Crucero por el río Moldava',
          'Degustación de cerveza checa',
          'Seguro de viaje'
        ],
        popular: false,
        presupuesto: 'bajo'
      },
      {
        id: 12,
        nombre: 'Dubái, Emiratos Árabes',
        ubicacion: 'Emiratos Árabes Unidos, Medio Oriente',
        region: 'asia',
        tipo: 'ciudad',
        descripcion: 'Ciudad del futuro con rascacielos impresionantes, lujo sin límites y experiencias únicas.',
        descripcionCompleta: 'Dubái es sinónimo de lujo y modernidad. Visita el Burj Khalifa, el edificio más alto del mundo, explora los gigantescos centros comerciales, disfruta de las playas de arena dorada, vive un safari por el desierto y descubre la mezcla única entre tradición árabe y vanguardia arquitectónica.',
        imagen: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
        precio: 'Desde $1,899',
        precioNumerico: 1899,
        rating: 4.6,
        duracion: '6 días / 5 noches',
        caracteristicas: ['Lujo', 'Rascacielos', 'Compras'],
        incluye: [
          'Vuelo ida y vuelta',
          'Hotel 5 estrellas con desayuno',
          'Entrada al Burj Khalifa',
          'Safari por el desierto con cena',
          'Tour por la ciudad',
          'Crucero Dubai Marina',
          'Seguro de viaje'
        ],
        popular: true,
        presupuesto: 'alto'
      }
    ];
  }

  filtrarDestinos(): void {
    this.destinosFiltrados = this.destinos.filter(destino => {
      const cumpleRegion = !this.filtroRegion || destino.region === this.filtroRegion;
      const cumpleTipo = !this.filtroTipo || destino.tipo === this.filtroTipo;
      const cumplePresupuesto = !this.filtroPresupuesto || destino.presupuesto === this.filtroPresupuesto;

      return cumpleRegion && cumpleTipo && cumplePresupuesto;
    });
  }

  limpiarFiltros(): void {
    this.filtroRegion = '';
    this.filtroTipo = '';
    this.filtroPresupuesto = '';
    this.destinosFiltrados = this.destinos;
  }

  verDetalles(destino: Destino): void {
    this.destinoSeleccionado = destino;
  }

  cerrarModal(): void {
    this.destinoSeleccionado = null;
  }

  reservar(destino: Destino): void {
    alert(`¡Reserva iniciada para ${destino.nombre}!\n\nEn breve un agente se pondrá en contacto contigo para completar tu reserva.`);
    this.cerrarModal();
  }
}