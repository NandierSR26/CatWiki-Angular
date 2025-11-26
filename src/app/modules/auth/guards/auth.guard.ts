import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (isAuthenticated()) {
    return true;
  }

  console.log('User not authenticated, redirecting to login');
  router.navigate(['/auth/login']);
  
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!isAuthenticated()) {
    return true;
  }

  console.log('User already authenticated, redirecting to home');
  router.navigate(['/']);
  
  return false;
};

function isAuthenticated(): boolean {
  const isAuth = localStorage.getItem('isAuthenticated');
  const token = localStorage.getItem('authToken');
  
  if (!isAuth || !token) {
    return false;
  }
  
  return isAuth === 'true';
}

export function getCurrentUser(): any | null {
  try {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('loginTimestamp');
}