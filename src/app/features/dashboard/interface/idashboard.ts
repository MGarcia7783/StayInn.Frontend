import { IDashboardActividad } from './idashboard-actividad';
import { IDashboardReservacion } from './idashboard-reservacion';
import { IDashboardTendencia } from './idashboard-tendencia';

export interface IDashboard {
  totalHabitaciones: number;
  habitacionesOcupadas: number;
  reservasPendientes: number;
  ingresosMesActual: number;
  llegadasHoy: IDashboardReservacion[];
  salidasHoy: IDashboardReservacion[];
  tendenciaReservas: IDashboardTendencia[];
  actividades: IDashboardActividad[];
}
