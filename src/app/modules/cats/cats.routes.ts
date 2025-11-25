import { Routes } from '@angular/router';
import { CatsLandingPage } from './pages/cats-landing-page/cats-landing-page';
import { BreedPage } from './pages/breed-page/breed-page';


export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: CatsLandingPage },
            { path: 'breed/:breedId', component: BreedPage },
            { path: '**', redirectTo: '' }
        ]
    }
];