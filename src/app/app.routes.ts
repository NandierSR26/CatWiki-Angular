import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'cats',
        loadChildren: () => import('./modules/cats/cats.routes').then(m => m.routes)
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.routes),
    },
    {
        path: '**', redirectTo: 'cats'
    }
];
