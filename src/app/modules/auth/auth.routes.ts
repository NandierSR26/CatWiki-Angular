import { Routes } from "@angular/router";
import { authGuard, guestGuard } from "./guards/auth.guard";

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/login-page/login-page').then(m => m.LoginPage),
                canActivate: [guestGuard] // Solo usuarios no autenticados
            },
            {
                path: 'register',
                loadComponent: () => import('./pages/register-page/register-page').then(m => m.RegisterPage),
                canActivate: [guestGuard] // Solo usuarios no autenticados
            },
            {
                path: 'profile',
                loadComponent: () => import('./pages/profile-page/profile-page').then(m => m.ProfilePage),
                canActivate: [authGuard] // Solo usuarios autenticados
            },
            {
                path: '**', redirectTo: 'login'
            }
        ]
    },
    {
        path: '**', redirectTo: ''
    }
]