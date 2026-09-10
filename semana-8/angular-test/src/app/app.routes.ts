import { Routes } from '@angular/router';
import { jwtGuard, jwtGuestGuard } from './auth-jwt/jwt.guard';
import { cookieGuard, cookieGuestGuard } from './auth-cookie/cookie.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'jwt/login',
    loadComponent: () => import('./auth-jwt/login/login').then((m) => m.Login),
    canActivate: [jwtGuestGuard],
  },
  {
    path: 'jwt/dashboard',
    loadComponent: () => import('./auth-jwt/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [jwtGuard],
  },
  {
    path: 'cookies/login',
    loadComponent: () => import('./auth-cookie/login/login').then((m) => m.Login),
    canActivate: [cookieGuestGuard],
  },
  {
    path: 'cookies/dashboard',
    loadComponent: () => import('./auth-cookie/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [cookieGuard],
  },
  { path: '**', redirectTo: '' },
];
