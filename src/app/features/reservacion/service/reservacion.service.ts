import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { IRegistro } from '../../usuario/interface/iregistro';
import { IReservacion } from '../interface/ireservacion';

@Injectable({
  providedIn: 'root',
})
export class ReservacionService {
  private http = inject(HttpClient);
  private url = `${environment.API_URL}/reservacion`;

  // Crear nueva reservacion
  crearReservacion(reservacion: IRegistro): Observable<IReservacion> {
    return this.http.post<IReservacion>(this.url, reservacion);
  }
}
