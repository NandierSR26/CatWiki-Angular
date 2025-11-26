import { ChangeDetectionStrategy, Component, signal, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { getCurrentUser, clearSession } from '../../guards/auth.guard';
import { User } from '../../interfaces/login.interface';

@Component({
  selector: 'app-profile-page',
  imports: [RouterModule],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePage implements OnInit {
  private readonly router = new Router();
  
  readonly currentUser = signal<User | null>(null);
  readonly memberSince = signal<string>('');
  readonly userInitials = signal<string>('U');

  // Datos ficticios para demonstración
  readonly profileStats = {
    favoriteBreeds: 12,
    searchesThisMonth: 45,
    profileViews: 23
  };

  readonly favoriteBreeds = [
    'Persian',
    'Maine Coon', 
    'Siamese',
    'British Shorthair'
  ];

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const user = getCurrentUser();
    if (user) {
      this.currentUser.set(user);
      
      // Generar iniciales del nombre
      const initials = user.name
        .split(' ')
        .map((name: string) => name.charAt(0))
        .join('')
        .toUpperCase();
      this.userInitials.set(initials);
      
      // Simular fecha de registro
      const loginTimestamp = localStorage.getItem('loginTimestamp');
      if (loginTimestamp) {
        const date = new Date(loginTimestamp);
        this.memberSince.set(date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        }));
      } else {
        this.memberSince.set('November 2025');
      }
    } else {
      // Usuario no autenticado, redirigir
      this.router.navigate(['/auth/login']);
    }
  }

  onEditProfile(): void {
    // Funcionalidad para editar perfil (placeholder)
    console.log('Edit profile clicked');
  }

  onLogout(): void {
    clearSession();
    this.router.navigate(['/']);
  }
}
