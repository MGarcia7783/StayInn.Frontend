import { Component, inject, OnInit, signal } from '@angular/core';
import { EsparcimientoService } from '../../../features/esparcimiento/service/esparcimiento-service';
import { HotelService } from '../../../features/hotel/service/hotel-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IHotel } from '../../../features/hotel/interface/ihotel';
import { IEsparcimiento } from '../../../features/esparcimiento/interface/iesparcimiento';

@Component({
  selector: 'app-lading-page',
  imports: [],
  templateUrl: './lading-page.html',
  styleUrl: './lading-page.css',
})
export class LadingPage implements OnInit {
  // Inyección de dependencias
  private esparcimientoService = inject(EsparcimientoService);
  private hotelService = inject(HotelService);
  private sanitizer = inject(DomSanitizer);

  // Signal de estado
  esMenuMovil = signal(false);
  esModal = signal(false);
  cargandoHotel = signal(false);
  cargando = signal(false);

  // Signal de datos
  hotel = signal<IHotel | null>(null);
  esparcimientos = signal<IEsparcimiento[]>([]);

  ngOnInit(): void {
    this.cargarDatosHotel();
    this.cargarEsparcimientos();
  }

  // Metodo para cargar datos del hotel
  cargarDatosHotel(): void {
    this.cargandoHotel.set(true);

    this.hotelService.cargarDatosHotel().subscribe({
      next: (data) => {
        this.hotel.set(data);
        this.cargandoHotel.set(false);
      },
    });
  }

  // Función para cargar mapa
  cargarMapa(): SafeResourceUrl | null {
    const h = this.hotel();
    if (!h || !h.latitud || !h.longitud) return null;

    // Formato de insersión de Google Maps
    const url = `https://maps.google.com/maps?q=${h.latitud},${h.longitud}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  // Cargar esparcimientos para la landing
  cargarEsparcimientos(): void {
    this.cargando.set(true);

    this.esparcimientoService.cargarEsparcimientoLanding().subscribe({
      next: (data) => {
        this.esparcimientos.set(data);
        this.cargando.set(false);
      },
    });
  }
}
