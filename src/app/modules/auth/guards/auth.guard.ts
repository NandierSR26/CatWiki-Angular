import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (AuthService.isAuthenticatedStatic()) {
    return true;
  }

  console.log('User not authenticated, redirecting to login');
  router.navigate(['/auth/login']);
  
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!AuthService.isAuthenticatedStatic()) {
    return true;
  }

  console.log('User already authenticated, redirecting to home');
  router.navigate(['/']);
  
  return false;
};

// Funciones de utilidad para compatibilidad (delegando a AuthService)
export function isAuthenticated(): boolean {
  return AuthService.isAuthenticatedStatic();
}

export function getCurrentUser() {
  return AuthService.getCurrentUserStatic();
}

export function clearSession(): void {
  // Usar el servicio para limpiar la sesión y actualizar los signals
  const authService = inject(AuthService);
  authService.logout();
}