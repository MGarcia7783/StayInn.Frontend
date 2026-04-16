import { Component, inject, signal } from '@angular/core';
import { HotelService } from '../../../features/hotel/service/hotel-service';
import { InteractionService } from '../../../shared/service/interaction.service';
import { IHotel } from '../../../features/hotel/interface/ihotel';
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  // Inyección de dependencias
  private hotelService = inject(HotelService);
  private interactionService = inject(InteractionService);

  // Signal de estado
  esMenuMovil = signal(false);
  cargandoHotel = signal(false);

  // Signal de datos del hotel
  hotel = signal<IHotel | null>(null);

  // Enlaces de navegación
  enlaces = [
    { ruta: '/inicio', etiqueta: 'Inicio' },
    { ruta: '/habitaciones-disponibles', etiqueta: 'Habitaciones' },
    { ruta: '/reservaciones', etiqueta: 'Reservaciones' },
  ];

  // Navegar en los enlaces
  async navegar(ruta: string) {
    this.esMenuMovil.set(false);
  }

  ngOnInit(): void {
    this.cargarDatosHotel();
  }

  // Método para cargar datos del hotel
  cargarDatosHotel() {
    this.cargandoHotel.set(true);

    this.hotelService.cargarDatoshotel().subscribe({
      next: (datos) => {
        this.hotel.set(datos);
        this.cargandoHotel.set(false);
      },
    });
  }

  // Alternar el menú móvil
  alternarMenuMovil() {
    this.esMenuMovil.update((valor) => !valor);
  }
}
