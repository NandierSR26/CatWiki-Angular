import { Routes } from '@angular/router';
import { CatsLandingPage } from './pages/cats-landing-page/cats-landing-page';
import { BreedPage } from './pages/breed-page/breed-page';
import { SearchPage } from './pages/search-page/search-page';


export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: CatsLandingPage },
            { path: 'breed/:breedId', component: BreedPage },
            { path: 'search', component: SearchPage },
            { path: '**', redirectTo: '' }
        ]
    }
];