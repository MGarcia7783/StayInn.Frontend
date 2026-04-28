import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  // Ruta por defecto
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../../../features/dashboard/components/dashboard').then((c) => c.Dashboard),
  },
  {
    path: 'hotel',
    loadChildren: () =>
      import('../../../features/hotel/routes/hotel.routes').then((c) => c.HOTEL_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
