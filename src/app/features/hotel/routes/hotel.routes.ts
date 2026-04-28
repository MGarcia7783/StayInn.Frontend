import { Routes } from '@angular/router';

export const HOTEL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../components/gestion-hotel').then((c) => c.GestionHotel),
  },
];
