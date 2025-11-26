import { CatService } from './../../services/cat-service.service';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ICatBreed } from '../../interfaces/cats.interface';
import { catchError, finalize, Subject, takeUntil } from 'rxjs';

interface SearchState {
  searchTerm: string;
  results: ICatBreed[];
  hasSearched: boolean;
}

@Component({
  selector: 'app-search-page',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPage implements OnInit, AfterViewInit, OnDestroy {
  private readonly catService = inject(CatService);
  private readonly router = inject(Router);
  private readonly destroy$ = new Subject<void>();
  private readonly STORAGE_KEY = 'cat-search-state';

  @ViewChild('searchInput', { static: true }) searchInputRef!: ElementRef<HTMLInputElement>;

  readonly cats = signal<ICatBreed[]>([]);
  readonly loading = signal<boolean>(false);
  readonly currentSearchTerm = signal<string>('');
  readonly hasSearched = signal<boolean>(false);

  ngOnInit(): void {
    this.loadSearchState();
  }

  ngAfterViewInit(): void {
    const currentTerm = this.currentSearchTerm();
    if (currentTerm && this.searchInputRef?.nativeElement) {
      this.searchInputRef.nativeElement.value = currentTerm;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSearchState(): void {
    try {
      const savedState = sessionStorage.getItem(this.STORAGE_KEY);
      if (savedState) {
        const state: SearchState = JSON.parse(savedState);
        this.currentSearchTerm.set(state.searchTerm);
        this.cats.set(state.results);
        this.hasSearched.set(state.hasSearched);
      }
    } catch (error) {
      console.error('Error loading search state:', error);
    }
  }

  private saveSearchState(): void {
    try {
      const state: SearchState = {
        searchTerm: this.currentSearchTerm(),
        results: this.cats(),
        hasSearched: this.hasSearched()
      };
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving search state:', error);
    }
  }

  searchCats(term: string): void {
    if (!term.trim()) {
      this.cats.set([]);
      this.currentSearchTerm.set('');
      this.hasSearched.set(false);
      this.clearSearchState();
      return;
    }

    this.currentSearchTerm.set(term.trim());
    this.hasSearched.set(true);
    this.loading.set(true);
    
    this.catService.searchCats(term).pipe(
      takeUntil(this.destroy$),
      catchError(error => {
        console.error('Error during cat search:', error);
        this.cats.set([]);
        return [];
      }),
      finalize(() => {
        this.loading.set(false);
        this.saveSearchState();
      })
    ).subscribe((results: ICatBreed[]) => {
      this.cats.set(results);
    });
  }

  navigateToBreed(breedId: string): void {
    // Guardar estado antes de navegar
    this.saveSearchState();
    this.router.navigate(['/cats/breed', breedId]);
  }

  clearSearch(): void {
    this.cats.set([]);
    this.currentSearchTerm.set('');
    this.hasSearched.set(false);
    this.clearSearchState();
    if (this.searchInputRef?.nativeElement) {
      this.searchInputRef.nativeElement.value = '';
    }
  }

  private clearSearchState(): void {
    try {
      sessionStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing search state:', error);
    }
  }

  getShortDescription(description: string): string {
    if (!description) return 'No description available';
    return description.length > 120 ? description.substring(0, 120) + '...' : description;
  }
}
