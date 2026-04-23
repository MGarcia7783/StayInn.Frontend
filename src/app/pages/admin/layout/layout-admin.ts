import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../auth/service/auth.service';
import { InteractionService } from '../../../shared/service/interaction.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-admin',
  imports: [ RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './layout-admin.html',
  styleUrl: './layout-admin.css',
})
export class LayoutAdmin {
  // Inyección de dependencias
  public authService = inject(AuthService);
  private interactionService = inject(InteractionService);
  private router = inject(Router);

  // Signal
  menuAbierto = signal(false);

  // Opciones de menú
  menuAdmin = [
    { texto: 'Dashboard', url: '/admin/dashboard', icono: 'fa-solid fa-chart-line' },
    { texto: 'Hotel', url: '/admin/hotel', icono: 'fa-solid fa-hotel' },
    { texto: 'Habitaciones', url: '/admin/habitaciones', icono: 'fa-solid fa-bed' },
    {
      texto: 'Esparcimiento',
      url: '/admin/area-esparcimiento/listado',
      icono: 'fa-solid fa-umbrella-beach',
    },
    { texto: 'Reservaciones', url: '/admin/reservaciones', icono: 'fa-solid fa-calendar-check' },
  ];

  alternarMenu() {
    this.menuAbierto.update((v) => !v);
  }

  async salir() {
    const resp = await this.interactionService.confirmar(
      'Cerrar Sesión',
      '¿Desea salir del panel de administración?',
    );
    if (resp) {
      this.authService.lagout();
      this.router.navigate(['/inicio']);
    }
  }
}
