import { Component, inject, OnInit, signal } from '@angular/core';
import { HotelService } from '../service/hotel-service';
import { InteractionService } from '../../../shared/service/interaction.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IHotel } from '../interface/ihotel';
import { FormField } from '@angular/forms/signals';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

@Component({
  selector: 'app-gestion-hotel',
  imports: [ReactiveFormsModule],
  templateUrl: './gestion-hotel.html',
  styleUrl: './gestion-hotel.css',
})
export class GestionHotel implements OnInit {
  // Inyección de dependencias
  private hotelService = inject(HotelService);
  private interactionService = inject(InteractionService);
  private fb = inject(FormBuilder);

  // Signal de estado
  hotel = signal<IHotel | null>(null);
  cargando = signal(false);
  vistaPrevia = signal<string | null>(null);

  archivoImagen: File | null = null;
  formHotel!: FormGroup;

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerInformacion();
  }

  // Crear formulario reactivo
  private inicializarFormulario() {
    this.formHotel = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(70)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      telefono: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      descripcion: ['', [Validators.required, Validators.maxLength(500)]],
      direccion: ['', [Validators.required, Validators.maxLength(250)]],
      latitud: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitud: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
      imagenPrincipal: [null],
    });
  }

  // Validar los controles
  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // Obtener información del hotel
  obtenerInformacion() {
    this.cargando.set(true);

    this.hotelService.cargarDatosHotel().subscribe({
      next: (data) => {
        if (data) {
          this.hotel.set(data);
          this.formHotel.patchValue(data);
          this.vistaPrevia.set(data.imagenPrincipal);

          // si existe registro del hotel, la imagen no es obligatoria
          this.formHotel.get('imagenPrincipal')?.clearValidators();
        } else {
          // si no existe registro del hotel, la imagen es obligatoria
          this.formHotel.get('imagenPrincipal')?.setValidators([Validators.required]);
        }
        this.formHotel.get('imagenPrincipal')?.updateValueAndValidity();
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.interactionService.mostrarError(error);
      },
    });
  }

  // Vista preeliminar de la imagen
  seleccionarArchivo(event: any) {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoImagen = archivo;
      this.formHotel.get('imagenPrincipal')?.setValue(archivo);

      const lector = new FileReader();
      lector.onload = () => this.vistaPrevia.set(lector.result as string);
      lector.readAsDataURL(archivo);
    }
  }

  // Guardar registro
  async guardarCambios() {
    if (this.formHotel.invalid) {
      this.formHotel.markAllAsTouched();
      return;
    }

    await this.interactionService.showLoading();

    const formData = new FormData();
    Object.keys(this.formHotel.controls).forEach((nombreControl) => {
      if (nombreControl !== 'imagenPrincipal') {
        formData.append(nombreControl, this.formHotel.get(nombreControl)?.value);
      }
    });

    // si el usuario seleccionó una imagen
    if (this.archivoImagen) {
      formData.append('imagenPrincipal', this.archivoImagen);
    }

    // Decidir entre crear o actualizar
    const operacion = this.hotel()
      ? this.hotelService.actualizarHotel(formData)
      : this.hotelService.crearHotel(formData);

    (operacion as any).subscribe({
      next: async (res: any) => {
        this.hotel.set(res);
        await this.interactionService.hideLoading();
        this.interactionService.showToast('Información registrada correctamente', 'success');

        this.archivoImagen = null;
      },
      error: async (err: any) => {
        await this.interactionService.hideLoading();
        this.interactionService.mostrarError(err);
      },
    });
  }
}
