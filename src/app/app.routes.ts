import { Routes } from '@angular/router';
import { Layout } from './pages/home/layout/layout';
import { AuthGuard } from './guards/AuthGuard';
import { ADMIN_ROUTES } from './pages/admin/routes/admin.routes';

export const routes: Routes = [
  // Bloque 1: Experiencia púbica y de clientes
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      {
        path: 'habitaciones-disponibles',
        loadComponent: () =>
          import('./pages/cliente/habitaciones/habitaciones-disponibles').then(
            (c) => c.HabitacionesDisponibles,
          ),
      },
      {
        path: 'inicio',
        loadComponent: () => import('./pages/home/landing/lading-page').then((c) => c.LadingPage),
      },
    ],
  },
  // Bloque 2: Experienca de administración
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/layout/layout-admin').then((c) => c.LayoutAdmin),
    canActivate: [AuthGuard],
    children: ADMIN_ROUTES,
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
