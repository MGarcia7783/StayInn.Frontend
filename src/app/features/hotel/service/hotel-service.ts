import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';
import { Observable } from 'rxjs';
import { IHotel } from '../interface/ihotel';

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private http = inject(HttpClient);
  private url = `${environment.API_URL}/hotel`;


  // Cargar información de un hotel
  cargarDatosHotel(): Observable<IHotel> {
    return this.http.get<IHotel>(`${this.url}`);
  }
}
