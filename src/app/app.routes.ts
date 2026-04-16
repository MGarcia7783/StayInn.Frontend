import { Routes } from '@angular/router';
import { Layout } from './pages/home/layout/layout';

export const routes: Routes = [
  // Bloque 1: Experiencia púbica y de clientes
  {
    path: '',
    component: Layout,
    children: [
      {
        path: 'inicio',
        loadComponent: () => import('./pages/home/landing/lading-page').then((c) => c.LadingPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
