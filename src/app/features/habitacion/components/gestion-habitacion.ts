import { Component, inject, OnInit, signal } from '@angular/core';
import { HabitacionService } from '../service/habitacion.service';
import { InteractionService } from '../../../shared/service/interaction.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { IHabitacion } from '../interface/ihabitacion';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { applyWhen } from '@angular/forms/signals';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gestion-habitacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-habitacion.html',
  styleUrl: './gestion-habitacion.css',
})
export class GestionHabitacion implements OnInit {
  private habitacionService = inject(HabitacionService);
  private interactionService = inject(InteractionService);
  private fb = inject(FormBuilder);

  habitaciones = signal<IHabitacion[]>([]);
  cargando = signal(false);

  private buscador$ = new Subject<string>();
  criterioBusqueda = signal('');

  // Lógica del modal
  modalAbierto = signal(false);
  habitacionSeleccionada = signal<IHabitacion | null>(null);
  formHabitacion!: FormGroup;

  // Paginación
  paginaActual = signal(1);
  totalPaginas = signal(1);
  tamanoPagina = 10;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.canfigurarBuscador();
    this.cargarHabitaciones();
  }

  // Inicializar formulario
  private inicializarFormulario() {
    this.formHabitacion = this.fb.group({
      numero: ['', [Validators.required, Validators.maxLength(10)]],
      capacidadMax: ['', [Validators.required, Validators.min(1)]],
      precioNoche: ['', [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      estaDisponible: [true],
    });
  }

  // Validar los controles
  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // Cargar todas las habitaciones
  cargarHabitaciones() {
    this.cargando.set(true);
    const busqueda = this.criterioBusqueda();

    const peticion = busqueda
      ? this.habitacionService.buscarHabitaciones(busqueda, this.paginaActual(), this.tamanoPagina)
      : this.habitacionService.obtenerHabitaciones(this.paginaActual(), this.tamanoPagina);

    peticion.subscribe({
      next: (res) => {
        this.habitaciones.set(res.elementos);
        this.totalPaginas.set(res.totalPaginas);
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        this.interactionService.mostrarError(err);
      },
    });
  }

  // Cambiar de página
  cambiarPagina(nuevaPagina: number) {
    this.paginaActual.set(nuevaPagina);
    this.cargarHabitaciones();
  }

  private canfigurarBuscador() {
    this.buscador$.pipe(debounceTime(400), distinctUntilChanged()).subscribe((texto) => {
      this.criterioBusqueda.set(texto);
      this.paginaActual.set(1);
      this.cargarHabitaciones();
    });
  }

  alBuscar(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.buscador$.next(input.value);
  }

  abrirModalNuevo() {
    this.habitacionSeleccionada.set(null);
    this.formHabitacion.reset({ estaDisponible: true, capacidadMax: 1, precioNoche: 0 });
    this.modalAbierto.set(true);
  }

  editarHabitacion(habitacion: IHabitacion) {
    this.habitacionSeleccionada.set(habitacion);
    this.formHabitacion.patchValue(habitacion);
    this.modalAbierto.set(true);
  }

  cerrarModal() {
    this.modalAbierto.set(false);
    this.habitacionSeleccionada.set(null);
  }

  // Guardar registro
  async guardar() {
    if (this.formHabitacion.invalid) return;

    await this.interactionService.showLoading();
    const datos = this.formHabitacion.value;
    const seleccionada = this.habitacionSeleccionada();

    // Decidir entre crear o actualizar
    const operacion = seleccionada
      ? this.habitacionService.actualizar(seleccionada.id, datos)
      : this.habitacionService.crear(datos);

    (operacion as any).subscribe({
      next: async () => {
        await this.interactionService.hideLoading();
        this.interactionService.showToast(
          seleccionada ? 'Actualizada exitosamente' : 'Creada exitosamente',
        );

        this.cerrarModal();
        this.cargarHabitaciones();
      },
      error: async (err: any) => {
        await this.interactionService.hideLoading();
        this.interactionService.mostrarError(err);
      },
    });
  }

  async eliminarHabitacion(id: number | undefined) {
    if (!id) return;

    const confirm = await this.interactionService.confirmar(
      '¿Eliminar habitación?',
      'Esta acción no se puede deshacer',
    );

    if (confirm) {
      await this.interactionService.showLoading();

      this.habitacionService.eliminar(id).subscribe({
        next: async () => {
          await this.interactionService.hideLoading();
          this.interactionService.showToast('Habitación eliminada', 'success');
          this.cargarHabitaciones();
        },
        error: async (err) => {
          await this.interactionService.hideLoading();
          this.interactionService.mostrarError(err);
        },
      });
    }
  }
}
