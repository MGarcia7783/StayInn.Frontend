import { Component, inject, signal } from '@angular/core';
import { HotelService } from '../../../features/hotel/service/hotel-service';
import { InteractionService } from '../../../shared/service/interaction.service';
import { IHotel } from '../../../features/hotel/interface/ihotel';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/service/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../features/usuario/service/usuario-service';
import { email } from '@angular/forms/signals';
import { IRegistro } from '../../../features/usuario/interface/iregistro';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSW_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  // Inyección de dependencias
  private hotelService = inject(HotelService);
  private interactionService = inject(InteractionService);
  public authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  // Signal de estado
  esMenuMovil = signal(false);
  cargandoHotel = signal(false);
  esModal = signal(false);
  vistaAuth = signal<'login' | 'registro'>('login');

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

    if (ruta.startsWith('/cliente') && !this.authService.estaAutenticado()) {
      await this.interactionService.showToast('Inicie sesión para continuar', 'warning');
      this.abrirModal();
    } else {
      this.router.navigate([ruta]);
    }
  }

  // Definir formulario
  loginForm!: FormGroup;
  registroForm!: FormGroup;

  ngOnInit(): void {
    this.cargarDatosHotel();
    this.inicializarFormularios();
  }

  // Método para cargar datos del hotel
  cargarDatosHotel() {
    this.cargandoHotel.set(true);

    this.hotelService.cargarDatosHotel().subscribe({
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

  // Cambiar vista entre el login y el registro
  cambiarVista(vista: 'login' | 'registro') {
    this.vistaAuth.set(vista);

    if (vista === 'login') {
      this.loginForm.reset();
    } else {
      this.registroForm.reset({ activo: true });
    }
  }

  // Inicializar formularios
  private inicializarFormularios() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.pattern(PASSW_PATTERN)],
      ],
    });

    this.registroForm = this.fb.group({
      nombreCompleto: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(60)],
      ],
      phoneNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.pattern(EMAIL_PATTERN)]],
      password: [
        '',
        [Validators.required, Validators.minLength(6), Validators.pattern(PASSW_PATTERN)],
      ],
      activo: [true, [Validators.required]],
    });
  }

  // Validar los controles
  isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  // Iniciar sesión
  async enviarLogin() {
    await this.interactionService.showLoading();

    const { email, password } = this.loginForm.value;

    this.authService.iniciarSesion(email, password).subscribe({
      next: async (res) => {
        await this.interactionService.hideLoading();
        this.cerrarModal();

        if (res.usuario.rol === 'Administrador') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/inicio']);
        }

        await this.interactionService.showToast(
          `¡Bienvenido de nuevo, ${res.usuario.nombreCompleto}`,
        );
      },
      error: async (err) => {
        await this.interactionService.hideLoading();
        await this.interactionService.mostrarError(err);
      },
    });
  }

  // Registrar un nuevo usuario
  async enviarRegistro() {
    await this.interactionService.showLoading();

    const usuario: IRegistro = {
      ...this.registroForm.value,
      rol: 'Cliente',
    };

    this.usuarioService.registrarUsuario(usuario).subscribe({
      next: async () => {
        await this.interactionService.hideLoading();
        await this.interactionService.showToast('Cuenta creada correctamente', 'success');
        this.cambiarVista('login');
      },
      error: async (err) => {
        await this.interactionService.hideLoading();
        await this.interactionService.mostrarError(err);
      },
    });
  }

  // Cerrar sesión
  async salir() {
    const confirm = await this.interactionService.confirmar(
      'Cerrar Sesión',
      '¿Seguro que desea salir?',
    );

    if (confirm) {
      this.authService.lagout();
      this.esMenuMovil.set(false);
      this.router.navigate(['/inicio']);
    }
  }

  abrirModal() {
    this.vistaAuth.set('login');
    this.esModal.set(true);
    this.esMenuMovil.set(false);
  }

  cerrarModal() {
    this.esModal.set(false);

    if (this.loginForm) {
      this.loginForm.reset();
    }

    if (this.registroForm) {
      this.registroForm.reset({ activo: true });
    }
  }
}
