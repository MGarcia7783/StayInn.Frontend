import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { IRespuestaHabitaciones } from '../interface/irespuesta-habitaciones';
import { IHabitacion } from '../interface/ihabitacion';

@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private http = inject(HttpClient);
  private url = `${environment.API_URL}/habitaciones`;

  // Listar habitaciones disponibles
  habitacionesDisponibles(
    pagina: number = 1,
    tamanoPagina: number = 10,
  ): Observable<IRespuestaHabitaciones> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanoPagina', tamanoPagina.toString());

    return this.http.get<IRespuestaHabitaciones>(`${this.url}/disponibles`, { params });
  }

  // Listar todas las habitaciobes
  obtenerHabitaciones(
    pagina: number = 1,
    tamanoPagina: number = 10,
  ): Observable<IRespuestaHabitaciones> {
    const params = new HttpParams()
      .set('pagina', pagina.toString())
      .set('tamanoPagina', tamanoPagina.toString());

    return this.http.get<IRespuestaHabitaciones>(this.url, { params });
  }

  // Buscar habitaciones
  buscarHabitaciones(
    valor: string,
    pagina: number = 1,
    tamanoPagina: number = 10,
  ): Observable<IRespuestaHabitaciones> {
    const params = new HttpParams()
      .set('valor', valor)
      .set('pagina', pagina.toString())
      .set('tamanoPagina', tamanoPagina.toString());

    return this.http.get<IRespuestaHabitaciones>(`${this.url}/buscar`, { params });
  }

  // Crear nueva habitacion
  crear(habitacion: IHabitacion): Observable<IHabitacion> {
    return this.http.post<IHabitacion>(this.url, habitacion);
  }

  // Actualizar habitación
  actualizar(id: number, habitacion: IHabitacion): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, habitacion);
  }

  // Eliminar habitación
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
