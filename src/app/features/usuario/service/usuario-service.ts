import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { IRegistro } from '../interface/iregistro';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private url = `${environment.API_URL}/usuario`;

  // Registrar un nuevo usuario
  registrarUsuario(usuario: IRegistro): Observable<any> {
    return this.http.post(`${this.url}/registro`, usuario);
  }
}
