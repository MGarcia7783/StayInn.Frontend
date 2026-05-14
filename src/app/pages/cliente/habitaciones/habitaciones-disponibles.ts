import { Component, inject, OnInit, signal } from '@angular/core';
import { HabitacionService } from '../../../features/habitacion/service/habitacion.service';
import { InteractionService } from '../../../shared/service/interaction.service';
import { AuthService } from '../../../auth/service/auth.service';
import { IHabitacion } from '../../../features/habitacion/interface/ihabitacion';
import { CommonModule } from '@angular/common';
import { ReservacionRegistro } from '../../../features/reservacion/components/registro/reservacion-registro';

@Component({
  selector: 'app-habitaciones-disponibles',
  imports: [CommonModule, ReservacionRegistro],
  templateUrl: './habitaciones-disponibles.html',
  styleUrl: './habitaciones-disponibles.css',
})
export class HabitacionesDisponibles implements OnInit {
  // Inyección de dependencias
  private habitacionService = inject(HabitacionService);
  private interactionService = inject(InteractionService);
  private authService = inject(AuthService);

  // signal para la lista de habitaciones disponibles
  habitacionesDisponibles = signal<IHabitacion[]>([]);
  cargando = signal(false);

  // Signals para la paginación
  paginaActual = signal(1);
  totalPaginas = signal(1);
  tamanoPagina = 10;

  // Signals para modal de reservaciones
  modalReserva = signal(false);
  habitacionSeleccionada = signal<IHabitacion | null>(null);

  ngOnInit(): void {
    this.cargarDisponibles();
  }

  // Cargar habitaciones disponibles
  cargarDisponibles() {
    this.cargando.set(true);

    this.habitacionService
      .habitacionesDisponibles(this.paginaActual(), this.tamanoPagina)
      .subscribe({
        next: (res) => {
          this.habitacionesDisponibles.set(res.elementos);
          this.totalPaginas.set(res.totalPaginas);
          this.cargando.set(false);
        },
        error: (err) => {
          this.cargando.set(false);
          this.interactionService.mostrarError(err);
        },
      });
  }

  // Método para cambiar de página
  cambiarPagina(nuevaPagina: number) {
    this.paginaActual.set(nuevaPagina);
    this.cargarDisponibles();
  }

  // Abrir modal modal
  async abrirReserva(habitacion: IHabitacion) {
    if (!this.authService.estaAutenticado()) {
      this.interactionService.showToast('Debes iniciar sesión para reservar', 'warning');
      return;
    }
    this.habitacionSeleccionada.set(habitacion);
    this.modalReserva.set(true);
  }

  cerrarModal() {
    this.modalReserva.set(false);
    this.habitacionSeleccionada.set(null);
  }

  reservacionExitosa() {
    this.cargarDisponibles();
  }
}
