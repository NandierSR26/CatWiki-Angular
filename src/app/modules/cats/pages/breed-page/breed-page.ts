import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CatService } from '../../services/cat-service.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ICatBreed } from '../../interfaces/cats.interface';
import { Subject, takeUntil, switchMap, catchError, of, finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CatImagesService } from '../../services/cat-images.service';

@Component({
  selector: 'app-breed-page',
  imports: [RouterModule, CommonModule],
  templateUrl: './breed-page.html',
  styleUrl: './breed-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreedPage implements OnInit, OnDestroy {
  private readonly catsService = inject(CatService);
  private readonly catImagesService = inject(CatImagesService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroy$ = new Subject<void>();

  readonly cat = signal<ICatBreed | null>(null);
  readonly catImages = signal<string[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$),
      switchMap(params => {
        const breedId = params['breedId'];
        
        if (!breedId) {
          this.error.set('No breed ID provided');
          return of(null);
        }

        // Reset states
        this.loading.set(true);
        this.error.set(null);
        this.cat.set(null);

        this.catImagesService.getCatImagesByBreed(breedId).subscribe({
          next: (images) => {
            this.catImages.set(images);
            console.log('Cat images loaded:', images);
          },
          error: (error) => {
            console.error('Error loading cat images:', error);
          }
        });

        return this.catsService.getCatById(breedId).pipe(
          catchError(error => {
            console.error('Error loading breed:', error);
            this.error.set('Failed to load cat breed. Please try again.');
            return of(null);
          }),
          finalize(() => this.loading.set(false))
        );
      })
    ).subscribe(catData => {
      if (catData) {
        this.cat.set(catData);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRetry(): void {
    const currentBreedId = this.route.snapshot.params['breedId'];
    if (currentBreedId) {
      this.ngOnInit();
    }
  }
}
