import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CatService } from '../../services/cat-service.service';
import { ICatBreed } from '../../interfaces/cats.interface';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cats-landing-page',
  imports: [RouterModule],
  templateUrl: './cats-landing-page.html',
  styleUrl: './cats-landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatsLandingPage implements OnInit {
  catsService = inject(CatService);
  router = inject(Router);
  carouselCats = signal<ICatBreed[]>([]);
  carouselCatsLoading = signal(true);
  page = signal(0);
  limit = signal(20);
  
  ngOnInit(): void {
    this.catsService.getCats().subscribe((data: ICatBreed[]) => {
      this.carouselCats.set(data);
      this.carouselCatsLoading.set(false);
    });
  }

  toBreedPage(breedId: string): void {
    if (breedId) {
      console.log('Navigating to breed page for breedId:', breedId);
      this.router.navigate(['/cats/breed', breedId]);
    }
  }

}
