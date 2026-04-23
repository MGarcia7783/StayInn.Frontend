import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { IDashboard } from '../interface/idashboard';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private url = `${environment.API_URL}/dashboard/resumen`;

  // Cargar datos
  obtenerResumen(): Observable<IDashboard> {
    return this.http.get<IDashboard>(this.url);
  }
}
