import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPage } from './login-page';
import { LoginService } from '../../services/login.service';
import { AuthService } from '../../services/auth.service';
import { ILoginResponse, ILoginRequest } from '../../interfaces/login.interface';

describe('LoginPage Component', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let mockLoginService: jasmine.SpyObj<LoginService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: Router;

  const mockLoginResponse: ILoginResponse = {
    message: 'Login successful',
    data: {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
    }
  };

  beforeEach(async () => {
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['login']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['saveUserSession']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginPage],
      providers: [
        provideRouter([]), // Provide an empty router configuration
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    mockLoginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router);

    // Spy on router methods
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));

    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
      expect(component.showPassword()).toBe(false);
    });

    it('should initialize login form with empty values and validators', () => {
      const form = component.loginForm;
      expect(form.get('email')?.value).toBe('');
      expect(form.get('password')?.value).toBe('');
      expect(form.valid).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should invalidate form when email is empty', () => {
      component.loginForm.patchValue({ email: '', password: 'password123' });
      expect(component.loginForm.invalid).toBe(true);
      expect(component.loginForm.get('email')?.errors?.['required']).toBeTruthy();
    });

    it('should invalidate form when email format is invalid', () => {
      component.loginForm.patchValue({ email: 'invalid-email', password: 'password123' });
      expect(component.loginForm.invalid).toBe(true);
      expect(component.loginForm.get('email')?.errors?.['email']).toBeTruthy();
    });

    it('should invalidate form when password is empty', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: '' });
      expect(component.loginForm.invalid).toBe(true);
      expect(component.loginForm.get('password')?.errors?.['required']).toBeTruthy();
    });

    it('should invalidate form when password is too short', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: '123' });
      expect(component.loginForm.invalid).toBe(true);
      expect(component.loginForm.get('password')?.errors?.['minlength']).toBeTruthy();
    });

    it('should validate form when all fields are correct', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
      expect(component.loginForm.valid).toBe(true);
    });
  });

  describe('getFieldError Method', () => {
    beforeEach(() => {
      // Mark form as touched to trigger validation errors
      component.loginForm.markAllAsTouched();
    });

    it('should return required error message for empty email', () => {
      component.loginForm.patchValue({ email: '' });
      const error = component.getFieldError('email');
      expect(error).toBe('Email is required');
    });

    it('should return email format error message', () => {
      component.loginForm.patchValue({ email: 'invalid-email' });
      const error = component.getFieldError('email');
      expect(error).toBe('Please enter a valid email address');
    });

    it('should return required error message for empty password', () => {
      component.loginForm.patchValue({ password: '' });
      const error = component.getFieldError('password');
      expect(error).toBe('Password is required');
    });

    it('should return minlength error message for short password', () => {
      component.loginForm.patchValue({ password: '123' });
      const error = component.getFieldError('password');
      expect(error).toBe('Password must be at least 6 characters');
    });

    it('should return null for valid field', () => {
      component.loginForm.patchValue({ email: 'test@example.com' });
      const error = component.getFieldError('email');
      expect(error).toBeNull();
    });

    it('should return null for untouched invalid field', () => {
      component.loginForm.reset();
      component.loginForm.patchValue({ email: '' });
      const error = component.getFieldError('email');
      expect(error).toBeNull();
    });
  });

  describe('togglePasswordVisibility Method', () => {
    it('should toggle password visibility from false to true', () => {
      expect(component.showPassword()).toBe(false);
      component.togglePasswordVisibility();
      expect(component.showPassword()).toBe(true);
    });

    it('should toggle password visibility from true to false', () => {
      component.showPassword.set(true);
      component.togglePasswordVisibility();
      expect(component.showPassword()).toBe(false);
    });
  });

  describe('onSubmit Method', () => {
    it('should not submit when form is invalid', () => {
      component.loginForm.patchValue({ email: '', password: '' });
      spyOn(component, 'markFormGroupTouched' as any);
      
      component.onSubmit();
      
      expect(component['markFormGroupTouched']).toHaveBeenCalled();
      expect(mockLoginService.login).not.toHaveBeenCalled();
    });

    it('should not submit when email is missing', () => {
      component.loginForm.patchValue({ email: '', password: 'password123' });
      component.onSubmit();
      expect(mockLoginService.login).not.toHaveBeenCalled();
    });

    it('should not submit when password is missing', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: '' });
      component.onSubmit();
      expect(mockLoginService.login).not.toHaveBeenCalled();
    });

    it('should submit with valid form data', () => {
      const loginData: ILoginRequest = { email: 'test@example.com', password: 'password123' };
      component.loginForm.patchValue(loginData);
      mockLoginService.login.and.returnValue(of(mockLoginResponse));

      component.onSubmit();

      expect(component.error()).toBeNull();
      expect(mockLoginService.login).toHaveBeenCalledWith(loginData);
    });

    it('should handle successful login', () => {
      const loginData: ILoginRequest = { email: 'test@example.com', password: 'password123' };
      component.loginForm.patchValue(loginData);
      mockLoginService.login.and.returnValue(of(mockLoginResponse));

      component.onSubmit();

      expect(mockAuthService.saveUserSession).toHaveBeenCalledWith(mockLoginResponse);
      expect(component.loading()).toBe(false);
      expect(component.loginForm.pristine).toBe(true);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should handle login error', () => {
      const loginData: ILoginRequest = { email: 'test@example.com', password: 'password123' };
      const errorResponse = { message: 'Invalid credentials' };
      component.loginForm.patchValue(loginData);
      mockLoginService.login.and.returnValue(throwError(() => errorResponse));
      spyOn(console, 'error');

      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith('Login error:', errorResponse);
    });

    it('should reset loading state and form after successful login', () => {
      const loginData: ILoginRequest = { email: 'test@example.com', password: 'password123' };
      component.loginForm.patchValue(loginData);
      mockLoginService.login.and.returnValue(of(mockLoginResponse));
      
      component.onSubmit();

      expect(component.loading()).toBe(false);
      expect(component.loginForm.get('email')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });
  });

  describe('markFormGroupTouched Method', () => {
    it('should mark all form controls as touched', () => {
      const emailControl = component.loginForm.get('email');
      const passwordControl = component.loginForm.get('password');
      
      expect(emailControl?.touched).toBe(false);
      expect(passwordControl?.touched).toBe(false);

      component['markFormGroupTouched']();

      expect(emailControl?.touched).toBe(true);
      expect(passwordControl?.touched).toBe(true);
    });
  });

  describe('Static Methods', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    afterEach(() => {
      localStorage.clear();
    });

    it('should return true when user is authenticated', () => {
      spyOn(AuthService, 'isAuthenticatedStatic').and.returnValue(true);
      expect(LoginPage.isAuthenticated()).toBe(true);
      expect(AuthService.isAuthenticatedStatic).toHaveBeenCalled();
    });

    it('should return false when user is not authenticated', () => {
      spyOn(AuthService, 'isAuthenticatedStatic').and.returnValue(false);
      expect(LoginPage.isAuthenticated()).toBe(false);
    });

    it('should return current user when available', () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
      spyOn(AuthService, 'getCurrentUserStatic').and.returnValue(mockUser);
      expect(LoginPage.getCurrentUser()).toEqual(mockUser);
      expect(AuthService.getCurrentUserStatic).toHaveBeenCalled();
    });

    it('should return null when no user is available', () => {
      spyOn(AuthService, 'getCurrentUserStatic').and.returnValue(null);
      expect(LoginPage.getCurrentUser()).toBeNull();
    });

    it('should return auth token from localStorage', () => {
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('authToken', mockToken);
      expect(LoginPage.getAuthToken()).toBe(mockToken);
    });

    it('should return null when no auth token exists', () => {
      expect(LoginPage.getAuthToken()).toBeNull();
    });
  });

  describe('Signal State Management', () => {
    it('should update loading signal during login process', () => {
      const loginData: ILoginRequest = { email: 'test@example.com', password: 'password123' };
      component.loginForm.patchValue(loginData);
      mockLoginService.login.and.returnValue(of(mockLoginResponse));

      expect(component.loading()).toBe(false);
      
      component.onSubmit();
      
      expect(component.loading()).toBe(false); // Should be false after successful response
    });

    it('should clear error signal at start of login', () => {
      component.error.set('Previous error');
      const loginData: ILoginRequest = { email: 'test@example.com', password: 'password123' };
      component.loginForm.patchValue(loginData);
      mockLoginService.login.and.returnValue(of(mockLoginResponse));

      component.onSubmit();

      expect(component.error()).toBeNull();
    });

    it('should maintain password visibility state independently', () => {
      expect(component.showPassword()).toBe(false);
      
      component.togglePasswordVisibility();
      expect(component.showPassword()).toBe(true);
      
      // Simulate form submission - password visibility should remain unchanged
      const loginData: ILoginRequest = { email: 'test@example.com', password: 'password123' };
      component.loginForm.patchValue(loginData);
      mockLoginService.login.and.returnValue(of(mockLoginResponse));
      component.onSubmit();
      
      expect(component.showPassword()).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should perform complete login flow', () => {
      // Arrange
      const loginData: ILoginRequest = { email: 'test@example.com', password: 'password123' };
      mockLoginService.login.and.returnValue(of(mockLoginResponse));

      // Act
      component.loginForm.patchValue(loginData);
      component.onSubmit();

      // Assert
      expect(mockLoginService.login).toHaveBeenCalledWith(loginData);
      expect(mockAuthService.saveUserSession).toHaveBeenCalledWith(mockLoginResponse);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      expect(component.loading()).toBe(false);
      expect(component.loginForm.pristine).toBe(true);
    });

    it('should handle form validation and error display flow', () => {
      // Arrange
      component.loginForm.patchValue({ email: 'invalid-email', password: '123' });
      component.loginForm.markAllAsTouched();

      // Act & Assert
      expect(component.getFieldError('email')).toBe('Please enter a valid email address');
      expect(component.getFieldError('password')).toBe('Password must be at least 6 characters');
      
      component.onSubmit();
      expect(mockLoginService.login).not.toHaveBeenCalled();
    });
  });
});