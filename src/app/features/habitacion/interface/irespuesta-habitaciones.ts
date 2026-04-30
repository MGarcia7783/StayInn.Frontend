import { IHabitacion } from './ihabitacion';

export interface IRespuestaHabitaciones {
  elementos: IHabitacion[];
  totalElementos: number;
  totalPaginas: number;
  numeroPagina: number;
}
