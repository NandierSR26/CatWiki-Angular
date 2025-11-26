import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ILoginResponse, User } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _currentUser = signal<User | null>(null);

  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();

  constructor(private router: Router) {
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus(): void {
    const isAuth = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('authToken');
    
    if (isAuth === 'true' && token) {
      this._isAuthenticated.set(true);
      
      // Cargar datos del usuario
      const currentUser = this.getCurrentUserFromStorage();
      this._currentUser.set(currentUser);
    } else {
      this._isAuthenticated.set(false);
      this._currentUser.set(null);
    }
  }

  private getCurrentUserFromStorage(): User | null {
    return AuthService.getCurrentUserStatic();
  }
  saveUserSession(response: ILoginResponse): void {
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    if (response.data?.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
      this._currentUser.set(response.data.user);
    }
    
    localStorage.setItem('isAuthenticated', 'true');
    
    this._isAuthenticated.set(true);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    
    // Redirigir al home
    this.router.navigate(['/']);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }


  static isAuthenticatedStatic(): boolean {
    const isAuth = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('authToken');
    
    if (!isAuth || !token) {
      return false;
    }
    
    return isAuth === 'true';
  }


  static getCurrentUserStatic(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }
}