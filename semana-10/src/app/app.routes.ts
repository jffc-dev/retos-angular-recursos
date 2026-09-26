import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'calculadora',
    loadComponent: () => import('./calculadora/paginas/calculadora-page/calculadora-page'),
  },
  {
    path: 'contador',
    loadComponent: () => import('./contador/componentes/contador/contador'),
  },
  {
    path: '**',
    redirectTo: 'calculadora',
  },
];
