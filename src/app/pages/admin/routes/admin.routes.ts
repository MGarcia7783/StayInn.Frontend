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
    path: '**',
    redirectTo: 'dashboard',
  },
];
