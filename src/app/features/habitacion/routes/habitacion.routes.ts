import { Routes } from '@angular/router';

export const HABITACION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../habitacion/components/gestion-habitacion').then((c) => c.GestionHabitacion),
  },
];
