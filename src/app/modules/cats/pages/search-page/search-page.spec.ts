import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SearchPage } from './search-page';
import { CatService } from '../../services/cat-service.service';
import { ICatBreed } from '../../interfaces/cats.interface';
import { ElementRef } from '@angular/core';

describe('SearchPage Component', () => {
  let component: SearchPage;
  let fixture: ComponentFixture<SearchPage>;
  let mockCatService: jasmine.SpyObj<CatService>;
  let mockRouter: Router;

  const mockSearchResults: ICatBreed[] = [
    {
      id: 'abys',
      name: 'Abyssinian',
      description: 'The Abyssinian is easy to care for, and a joy to have in your home. They are very active and energetic cats.',
      temperament: 'Active, Energetic, Independent',
      origin: 'Egypt',
      life_span: '14 - 15',
      weight: { imperial: '7 - 10', metric: '3 - 5' },
      country_codes: 'EG',
      country_code: 'EG',
      adaptability: 5,
      affection_level: 5,
      child_friendly: 3,
      dog_friendly: 4,
      energy_level: 5,
      grooming: 1,
      health_issues: 2,
      intelligence: 5,
      shedding_level: 2,
      social_needs: 5,
      stranger_friendly: 5,
      vocalisation: 1,
      experimental: 0,
      hairless: 0,
      natural: 1,
      rare: 0,
      rex: 0,
      suppressed_tail: 0,
      short_legs: 0,
      indoor: 0,
      wikipedia_url: 'https://en.wikipedia.org/wiki/Abyssinian_cat',
      hypoallergenic: 0,
      reference_image_id: '0XYvRd7oD',
      image: {
        id: '0XYvRd7oD',
        width: 1204,
        height: 1445,
        url: 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg'
      }
    }
  ];

  beforeEach(async () => {
    const catServiceSpy = jasmine.createSpyObj('CatService', ['searchCats']);

    await TestBed.configureTestingModule({
      imports: [SearchPage],
      providers: [
        provideRouter([]),
        { provide: CatService, useValue: catServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPage);
    component = fixture.componentInstance;
    mockCatService = TestBed.inject(CatService) as jasmine.SpyObj<CatService>;
    mockRouter = TestBed.inject(Router);

    // Mock sessionStorage
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    spyOn(sessionStorage, 'setItem');
    spyOn(sessionStorage, 'removeItem');
    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
  });

  describe('1. Component Initialization & State Management', () => {
    it('should create with default values', () => {
      expect(component).toBeTruthy();
      expect(component.cats()).toEqual([]);
      expect(component.loading()).toBe(false);
      expect(component.currentSearchTerm()).toBe('');
      expect(component.hasSearched()).toBe(false);
    });

    it('should load saved search state from sessionStorage', () => {
      const savedState = {
        searchTerm: 'persian',
        results: mockSearchResults,
        hasSearched: true
      };
      (sessionStorage.getItem as jasmine.Spy).and.returnValue(JSON.stringify(savedState));

      component.ngOnInit();

      expect(component.currentSearchTerm()).toBe('persian');
      expect(component.cats()).toEqual(mockSearchResults);
      expect(component.hasSearched()).toBe(true);
    });
  });

  describe('2. Search Functionality', () => {
    it('should perform search and update results', () => {
      mockCatService.searchCats.and.returnValue(of(mockSearchResults));

      component.searchCats('abyssinian');

      expect(mockCatService.searchCats).toHaveBeenCalledWith('abyssinian');
      expect(component.currentSearchTerm()).toBe('abyssinian');
      expect(component.hasSearched()).toBe(true);
      expect(component.cats()).toEqual(mockSearchResults);
      expect(component.loading()).toBe(false);
    });

    it('should clear results when searching with empty term', () => {
      component.searchCats('  ');

      expect(component.cats()).toEqual([]);
      expect(component.currentSearchTerm()).toBe('');
      expect(component.hasSearched()).toBe(false);
      expect(sessionStorage.removeItem).toHaveBeenCalled();
    });

    it('should handle search errors gracefully', () => {
      mockCatService.searchCats.and.returnValue(throwError(() => new Error('Search error')));
      spyOn(console, 'error');

      component.searchCats('test');

      expect(console.error).toHaveBeenCalledWith('Error during cat search:', jasmine.any(Error));
      expect(component.cats()).toEqual([]);
      expect(component.loading()).toBe(false);
    });
  });

  describe('3. Navigation & State Persistence', () => {
    it('should navigate to breed page and save state', () => {
      component.navigateToBreed('abys');

      expect(sessionStorage.setItem).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cats/breed', 'abys']);
    });
  });

  describe('4. Clear Functionality', () => {
    it('should clear search results and state', () => {
      // Set up some initial state first
      mockCatService.searchCats.and.returnValue(of(mockSearchResults));
      component.searchCats('test');
      
      // Mock the search input element
      const mockElement = { value: 'test' } as HTMLInputElement;
      component.searchInputRef = { nativeElement: mockElement } as ElementRef<HTMLInputElement>;

      component.clearSearch();

      expect(component.cats()).toEqual([]);
      expect(component.currentSearchTerm()).toBe('');
      expect(component.hasSearched()).toBe(false);
      expect(sessionStorage.removeItem).toHaveBeenCalled();
      expect(mockElement.value).toBe('');
    });
  });

  describe('5. Utility Functions', () => {
    it('should format description correctly', () => {
      const longDescription = 'A'.repeat(150);
      const shortDescription = 'Short description';

      expect(component.getShortDescription(longDescription)).toBe('A'.repeat(120) + '...');
      expect(component.getShortDescription(shortDescription)).toBe(shortDescription);
      expect(component.getShortDescription('')).toBe('No description available');
      expect(component.getShortDescription(null as any)).toBe('No description available');
    });
  });
});
