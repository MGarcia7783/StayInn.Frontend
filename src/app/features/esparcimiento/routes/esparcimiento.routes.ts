import { Routes } from '@angular/router';

export const ESPARCIMIENTO_ROUTES: Routes = [
  {
    path: 'listado',
    loadComponent: () =>
      import('../../esparcimiento/components/listado/esparcimiento-listado').then(
        (c) => c.EsparcimientoListado,
      ),
  },
  {
    path: '',
    redirectTo: 'listado',
    pathMatch: 'full',
  },
];
