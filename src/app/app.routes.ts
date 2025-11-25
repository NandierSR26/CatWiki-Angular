import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./modules/cats/cats.routes').then(m => m.routes)
    },
    {
        path: '**', redirectTo: ''
    }
];
