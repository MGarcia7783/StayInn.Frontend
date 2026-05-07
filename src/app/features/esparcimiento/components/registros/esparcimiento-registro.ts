import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EsparcimientoService } from '../../service/esparcimiento-service';
import { InteractionService } from '../../../../shared/service/interaction.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-esparcimiento-registro',
  imports: [ReactiveFormsModule],
  templateUrl: './esparcimiento-registro.html',
  styleUrl: './esparcimiento-registro.css',
})
export class EsparcimientoRegistro implements OnInit {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private esparcimientoService = inject(EsparcimientoService);
  private interactionService = inject(InteractionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals
  esEdicion = signal(false);
  espacirmientoId = signal<number | null>(null);
  vistaPrevia = signal<string | null>(null);
  archivoImagen: File | null = null;
  formEsparcimiento!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();

    // Detectar si se recibe un ID por ruta
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.esEdicion.set(true);
      this.espacirmientoId.set(Number(id));
      this.cargarDatos(Number(id));
    } else {
      // Si es nuevo, la imagen es obligatoria
      this.formEsparcimiento.get('imagenUrl')?.setValidators([Validators.required]);
    }
  }

  // Crear formulario reactivo
  private inicializarFormulario() {
    this.formEsparcimiento = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      imagenUrl: [null],
    });
  }

  // Validar los controles
  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  cargarDatos(id: number) {
    this.esparcimientoService.obtenerPorId(id).subscribe({
      next: (res) => {
        this.formEsparcimiento.patchValue({ nombre: res.nombre });
        this.vistaPrevia.set(res.imagenUrl);
      },
      error: (err) => this.interactionService.mostrarError(err),
    });
  }

  seleccionarArchivo(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoImagen = file;
      this.formEsparcimiento.get('imagenUrl')?.setValue(file);
      const reader = new FileReader();
      reader.onload = () => this.vistaPrevia.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  async guardar() {
    if (this.formEsparcimiento.invalid) {
      this.formEsparcimiento.markAllAsTouched();
      return;
    }

    await this.interactionService.showLoading();

    const formData = new FormData();
    formData.append('nombre', this.formEsparcimiento.get('nombre')?.value);

    if (this.archivoImagen) {
      formData.append('imagenUrl', this.archivoImagen);
    }

    const operacion = this.esEdicion()
      ? this.esparcimientoService.actualizar(this.espacirmientoId()!, formData)
      : this.esparcimientoService.crear(formData);

    (operacion as any).subscribe({
      next: async () => {
        await this.interactionService.hideLoading();
        this.interactionService.showToast(
          this.esEdicion() ? 'Actualizado' : 'Registrado correctamente',
          'success',
        );
        this.regresar();
      },
      error: async (err: any) => {
        await this.interactionService.hideLoading();
        this.interactionService.mostrarError(err);
      },
    });
  }

  regresar() {
    this.router.navigate(['/admin/area-esparcimiento']);
  }
}
