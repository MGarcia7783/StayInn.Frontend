import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environment/environment';
import { ILogin } from '../interface/ilogin';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../interface/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private url = `${environment.API_URL}/usuario`;

  // Recuperar el usuario actual
  private usuario = signal<ILogin | null>(JSON.parse(localStorage.getItem('usuario') || 'null'));

  // Recuperar el token
  private token = signal<string | null>(localStorage.getItem('token') || null);

  // Crear una señal solo lectura para que otros compoenetes
  // sepan si e usario esta autenticado o no
  public usarioActual = computed(() => this.usuario());
  public estaAutenticado = computed(() => !!this.token());
  public rolUsuario = computed(() => this.usuario()?.rol || null);

  // Iniciar sesión
  iniciarSesion(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.url}/login`, { email, password })
      .pipe(tap((res) => this.establecerSesion(res)));
  }

  // Guardar los datos en signal y localStorage
  private establecerSesion(res: AuthResponse): void {
    this.usuario.set(res.usuario);
    this.token.set(res.token);

    // Guardar en el navegador para mantener la sesión al recargar
    localStorage.setItem('token', res.token);
    localStorage.setItem('usuario', JSON.stringify(res.usuario));
  }

  // Borrar los datos de sesión
  lagout(): void {
    this.usuario.set(null);
    this.token.set(null);
    localStorage.clear();
  }

  // Retornar el token actual para usarlo en los interceptores
  obtenerToken(): string | null {
    return this.token();
  }
}
