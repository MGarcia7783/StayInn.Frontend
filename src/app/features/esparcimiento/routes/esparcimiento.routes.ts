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
    path: 'nuevo',
    loadComponent: () =>
      import('../../esparcimiento/components/registros/esparcimiento-registro').then(
        (c) => c.EsparcimientoRegistro,
      ),
  },
  {
    path: 'editar/:id',
    loadComponent: () =>
      import('../../esparcimiento/components/registros/esparcimiento-registro').then(
        (c) => c.EsparcimientoRegistro,
      ),
  },
  {
    path: '',
    redirectTo: 'listado',
    pathMatch: 'full',
  },
];
