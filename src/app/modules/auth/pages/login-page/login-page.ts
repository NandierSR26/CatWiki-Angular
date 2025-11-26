import { LoginService } from './../../services/login.service';
import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ILoginResponse, User } from '../../interfaces/login.interface';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    if (!email || !password) {
      return;
    }

    // Set loading state
    this.loading.set(true);
    this.error.set(null);

    this.loginService.login({ email, password }).subscribe({
      next: (response: ILoginResponse) => {
        
        // Save authentication data to maintain session
        this.saveUserSession(response);
        
        // Reset form and loading state
        this.loginForm.reset();
        this.loading.set(false);
        
        // Redirect to dashboard or home page
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error:', error);

      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  private markFormGroupTouched(): void {
    for (const field of Object.keys(this.loginForm.controls)) {
      const control = this.loginForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    }
  }

  getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }

  private saveUserSession(response: ILoginResponse): void {
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    if (response.data?.user) {
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    
    
    localStorage.setItem('isAuthenticated', 'true');
  }

  static isAuthenticated(): boolean {
    const isAuth = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('authToken');
    
    if (!isAuth || !token) {
      return false;
    }
    
    return isAuth === 'true';
  }

  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  static clearUserSession(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
  }

  static logout(): void {
    this.clearUserSession();
  }
}
