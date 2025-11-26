import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegisterPage } from './register-page';
import { RegisterService } from '../../services/register.service';
import { IRegisterResponse, IRegisterRequest } from '../../interfaces/register.interface';

describe('RegisterPage Component', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let mockRegisterService: jasmine.SpyObj<RegisterService>;
  let mockRouter: Router;

  const mockRegisterResponse: IRegisterResponse = {
    message: 'Registration successful',
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }
  };

  beforeEach(async () => {
    const registerServiceSpy = jasmine.createSpyObj('RegisterService', ['register']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterPage],
      providers: [
        provideRouter([]), // Provide an empty router configuration
        { provide: RegisterService, useValue: registerServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    mockRegisterService = TestBed.inject(RegisterService) as jasmine.SpyObj<RegisterService>;
    mockRouter = TestBed.inject(Router);

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
      expect(component.showConfirmPassword()).toBe(false);
    });

    it('should initialize register form with empty values', () => {
      const form = component.registerForm;
      expect(form.get('name')?.value).toBe('');
      expect(form.get('email')?.value).toBe('');
      expect(form.get('password')?.value).toBe('');
      expect(form.get('confirmPassword')?.value).toBe('');
      expect(form.valid).toBe(false);
    });
  });

  describe('Form Fields Visibility', () => {
    it('should display all form fields', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      expect(compiled.querySelector('#name')).toBeTruthy();
      expect(compiled.querySelector('#email')).toBeTruthy();
      expect(compiled.querySelector('#password')).toBeTruthy();
      expect(compiled.querySelector('#confirmPassword')).toBeTruthy();
    });

    it('should display form labels correctly', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      
      expect(compiled.querySelector('label[for="name"]')?.textContent).toBe('Full Name');
      expect(compiled.querySelector('label[for="email"]')?.textContent).toBe('Email Address');
      expect(compiled.querySelector('label[for="password"]')?.textContent).toBe('Password');
      expect(compiled.querySelector('label[for="confirmPassword"]')?.textContent).toBe('Confirm Password');
    });

    it('should display submit button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const submitButton = compiled.querySelector('button[type="submit"]');
      
      expect(submitButton).toBeTruthy();
      expect(submitButton?.textContent?.trim()).toContain('Create Account');
    });

    it('should display register link to login page', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const loginLink = compiled.querySelector('a[routerLink="/auth/login"]');
      
      expect(loginLink).toBeTruthy();
      expect(loginLink?.textContent?.trim()).toBe('Sign in');
    });
  });

  describe('Form Validation', () => {
    it('should show error when name is empty', () => {
      const nameControl = component.registerForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('');
      fixture.detectChanges();

      expect(component.getFieldError('name')).toBe('Name is required');
    });

    it('should show error when name is too short', () => {
      const nameControl = component.registerForm.get('name');
      nameControl?.markAsTouched();
      nameControl?.setValue('A');
      fixture.detectChanges();

      expect(component.getFieldError('name')).toBe('Name must be at least 2 characters');
    });

    it('should show error when email is empty', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.markAsTouched();
      emailControl?.setValue('');
      fixture.detectChanges();

      expect(component.getFieldError('email')).toBe('Email is required');
    });

    it('should show error when email format is invalid', () => {
      const emailControl = component.registerForm.get('email');
      emailControl?.markAsTouched();
      emailControl?.setValue('invalid-email');
      fixture.detectChanges();

      expect(component.getFieldError('email')).toBe('Please enter a valid email address');
    });

    it('should show error when password is empty', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.markAsTouched();
      passwordControl?.setValue('');
      fixture.detectChanges();

      expect(component.getFieldError('password')).toBe('Password is required');
    });

    it('should show error when password is too short', () => {
      const passwordControl = component.registerForm.get('password');
      passwordControl?.markAsTouched();
      passwordControl?.setValue('123');
      fixture.detectChanges();

      expect(component.getFieldError('password')).toBe('Password must be at least 6 characters');
    });

    it('should show error when passwords do not match', () => {
      component.registerForm.patchValue({
        password: 'password123',
        confirmPassword: 'different'
      });
      
      const confirmPasswordControl = component.registerForm.get('confirmPassword');
      confirmPasswordControl?.markAsTouched();
      fixture.detectChanges();

      expect(component.getFieldError('confirmPassword')).toBe('Passwords do not match');
    });
  });

  describe('Error Messages Display', () => {
    it('should display field error messages in the DOM', () => {
      // Make form invalid and touched
      component.registerForm.patchValue({
        name: '',
        email: 'invalid-email'
      });
      component.registerForm.markAllAsTouched();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorElements = compiled.querySelectorAll('.form-error');
      
      expect(errorElements.length).toBeGreaterThan(0);
    });

    it('should display general error message when registration fails', () => {
      component.error.set('Registration failed');
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const errorElement = compiled.querySelector('.form-error');
      
      expect(errorElement?.textContent?.trim()).toBe('Registration failed');
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword()).toBe(false);
      
      component.togglePasswordVisibility();
      
      expect(component.showPassword()).toBe(true);
    });

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword()).toBe(false);
      
      component.toggleConfirmPasswordVisibility();
      
      expect(component.showConfirmPassword()).toBe(true);
    });
  });

  describe('Form Submission', () => {
    it('should not submit when form is invalid', () => {
      component.registerForm.patchValue({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      component.onSubmit();

      expect(mockRegisterService.register).not.toHaveBeenCalled();
    });

    it('should submit when form is valid', () => {
      const registerData: IRegisterRequest = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      component.registerForm.patchValue({
        ...registerData,
        confirmPassword: 'password123'
      });
      
      mockRegisterService.register.and.returnValue(of(mockRegisterResponse));

      component.onSubmit();

      expect(mockRegisterService.register).toHaveBeenCalledWith(registerData);
    });

    it('should handle registration error', () => {
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      };
      
      component.registerForm.patchValue(registerData);
      
      const errorResponse = { error: { message: 'Email already exists' } };
      mockRegisterService.register.and.returnValue(throwError(() => errorResponse));

      component.onSubmit();

      expect(component.error()).toBe('Email already exists');
      expect(component.loading()).toBe(false);
    });
  });
});