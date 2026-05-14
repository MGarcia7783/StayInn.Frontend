export interface IReservacion {
  id: number;
  habitacionId: number;
  fechaEntrada: string;
  fechaSalida: string;
  montoTotal?: number;
  estado?: string;
  numeroHabitacion?: string;
  nombreUsuario?: string;
}
