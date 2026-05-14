import { Component, inject, input, OnInit, output } from '@angular/core';
import { Form, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservacionService } from '../../service/reservacion.service';
import { IHabitacion } from '../../../habitacion/interface/ihabitacion';
import { InteractionService } from '../../../../shared/service/interaction.service';

@Component({
  selector: 'app-reservacion-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './reservacion-registro.html',
  styleUrl: './reservacion-registro.css',
})
export class ReservacionRegistro implements OnInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private reservacionService = inject(ReservacionService);
  private interactionService = inject(InteractionService);

  habitacion = input.required<IHabitacion>();
  alCerrar = output<void>();
  alExito = output<void>();

  // Signal
  reservaForm!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario() {
    this.reservaForm = this.fb.group({
      fechaEntrada: ['', Validators.required],
      fechaSalida: ['', Validators.required],
    });
  }

  async confirmaReservacion() {
    if (this.reservaForm.invalid) return;

    await this.interactionService.showLoading();
    const reservacion = {
      habitacionId: this.habitacion()?.id,
      ...this.reservaForm.value,
    };

    this.reservacionService.crearReservacion(reservacion).subscribe({
      next: async () => {
        await this.interactionService.hideLoading();
        await this.interactionService.showToast('Reservación creada con éxito');
        this.alExito.emit();
        this.cerrar();
      },
      error: async (err) => {
        await this.interactionService.hideLoading();
        await this.interactionService.mostrarError(err);
      },
    });
  }

  cerrar() {
    this.alCerrar.emit();
    this.reservaForm.reset();
  }
}
