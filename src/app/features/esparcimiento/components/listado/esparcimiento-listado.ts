import { Component, inject, OnInit, signal } from '@angular/core';
import { EsparcimientoService } from '../../service/esparcimiento-service';
import { InteractionService } from '../../../../shared/service/interaction.service';
import { Router } from '@angular/router';
import { IAreaEsparcimiento } from '../../interface/iarea-esparcimiento';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-esparcimiento-listado',
  imports: [],
  templateUrl: './esparcimiento-listado.html',
  styleUrl: './esparcimiento-listado.css',
})
export class EsparcimientoListado implements OnInit {
  // Inyección de dependencias
  private esparcmientoService = inject(EsparcimientoService);
  private interactionService = inject(InteractionService);
  private router = inject(Router);

  // Signal
  esparciemientos = signal<IAreaEsparcimiento[]>([]);
  cargando = signal(false);

  // Búsqueda
  private buscador$ = new Subject<string>();
  criterioBusqueda = signal('');

  ngOnInit(): void {
    this.cargarAreas();
    this.configurarBuscador();
  }

  // Cargar registros
  cargarAreas() {
    this.cargando.set(true);
    const busqueda = this.criterioBusqueda();

    const peticion = busqueda
      ? this.esparcmientoService.buscarAreas(busqueda)
      : this.esparcmientoService.cargarEsparcimientos();

    (peticion as any).subscribe({
      next: (res: any) => {
        this.esparciemientos.set(res);
        this.cargando.set(false);
      },
      error: (err: any) => {
        this.cargando.set(false);
        this.interactionService.mostrarError(err);
      },
    });
  }

  // Buscar registros
  private configurarBuscador() {
    this.buscador$.pipe(debounceTime(400), distinctUntilChanged()).subscribe((texto) => {
      this.criterioBusqueda.set(texto);
      this.cargarAreas();
    });
  }

  alBuscar(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.buscador$.next(input.value);
  }

  irANuevo() {
    this.router.navigate(['/admin/area-esparcimiento/nuevo']);
  }

  irAEditar(id: number) {
    this.router.navigate(['/admin/area-esparcimiento/editar', id]);
  }

  async eliminar(id: number) {
    if (!id) return;

    const confirm = await this.interactionService.confirmar(
      '¿Eliminar habitación?',
      'Esta acción no se puede deshacer',
    );

    if (confirm) {
      await this.interactionService.showLoading();

      this.esparcmientoService.eliminarArea(id).subscribe({
        next: async () => {
          await this.interactionService.hideLoading();
          this.interactionService.showToast('Registro eliminado', 'success');
          this.cargarAreas();
        },
        error: (err: any) => {
          this.cargando.set(false);
          this.interactionService.mostrarError(err);
        },
      });
    }
  }
}
