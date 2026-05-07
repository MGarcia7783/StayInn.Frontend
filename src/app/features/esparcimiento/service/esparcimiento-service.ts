import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { IEsparcimiento } from '../interface/iesparcimiento';
import { IAreaEsparcimiento } from '../interface/iarea-esparcimiento';

@Injectable({
  providedIn: 'root',
})
export class EsparcimientoService {
  private http = inject(HttpClient);
  private url = `${environment.API_URL}/areaesparcimiento`;

  // Cargar información para el landing page
  cargarEsparcimientoLanding(): Observable<IEsparcimiento[]> {
    return this.http.get<IEsparcimiento[]>(`${this.url}/home`);
  }

  // Cargar registros
  cargarEsparcimientos(): Observable<IAreaEsparcimiento[]> {
    return this.http.get<IAreaEsparcimiento[]>(this.url);
  }

  // Buscar registros
  buscarAreas(nombre: string): Observable<IAreaEsparcimiento> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<IAreaEsparcimiento>(`${this.url}/buscar`, { params });
  }

  // Obtener registro por Id
  obtenerPorId(id: number): Observable<IAreaEsparcimiento> {
    return this.http.get<IAreaEsparcimiento>(`${this.url}/${id}`);
  }

  // Crear registro (FromData por la Imagen)
  crear(datos: FormData): Observable<IAreaEsparcimiento> {
    return this.http.post<IAreaEsparcimiento>(this.url, datos);
  }

  // Actualizar regstro
  actualizar(id: number, datos: FormData): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, datos);
  }

  // Eliminar regstro
  eliminarArea(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
