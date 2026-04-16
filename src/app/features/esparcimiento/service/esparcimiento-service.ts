import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { IEsparcimiento } from '../interface/iesparcimiento';

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
}
