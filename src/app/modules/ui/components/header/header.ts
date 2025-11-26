import { ChangeDetectionStrategy, Component, signal, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { getCurrentUser, clearSession } from '../../../auth/guards/auth.guard';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header implements OnInit {
  private readonly router = inject(Router);
  
  readonly isAuthenticated = signal(false);
  readonly currentUser = signal<any>(null);

  ngOnInit(): void {
    this.checkAuthenticationStatus();
  }

  private checkAuthenticationStatus(): void {
    const isAuth = localStorage.getItem('isAuthenticated');
    const token = localStorage.getItem('authToken');
    
    if (isAuth === 'true' && token) {
      this.isAuthenticated.set(true);
      this.currentUser.set(getCurrentUser());
    } else {
      this.isAuthenticated.set(false);
      this.currentUser.set(null);
    }
  }

  onLogout(): void {
    // Limpiar la sesión
    clearSession();
    
    // Actualizar el estado del componente
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    
    // Redirigir al home
    this.router.navigate(['/']);
  }

  // Método para refrescar el estado de autenticación (útil para llamar desde otros componentes)
  refreshAuthStatus(): void {
    this.checkAuthenticationStatus();
  }
}
