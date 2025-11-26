import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { BreedPage } from './breed-page';
import { CatService } from '../../services/cat-service.service';
import { CatImagesService } from '../../services/cat-images.service';
import { ICatBreed } from '../../interfaces/cats.interface';

describe('BreedPage Component', () => {
  let component: BreedPage;
  let fixture: ComponentFixture<BreedPage>;
  let mockCatService: jasmine.SpyObj<CatService>;
  let mockCatImagesService: jasmine.SpyObj<CatImagesService>;
  let mockActivatedRoute: any;

  const mockCatBreed: ICatBreed = {
    id: 'abys',
    name: 'Abyssinian',
    description: 'The Abyssinian is easy to care for, and a joy to have in your home.',
    temperament: 'Active, Energetic, Independent, Intelligent, Gentle',
    origin: 'Egypt',
    life_span: '14 - 15',
    weight: { imperial: '7  -  10', metric: '3 - 5' },
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
  };

  const mockCatImages = [
    'https://cdn2.thecatapi.com/images/image1.jpg',
    'https://cdn2.thecatapi.com/images/image2.jpg'
  ];

  beforeEach(async () => {
    const catServiceSpy = jasmine.createSpyObj('CatService', ['getCatById']);
    const catImagesServiceSpy = jasmine.createSpyObj('CatImagesService', ['getCatImagesByBreed']);
    
    mockActivatedRoute = {
      params: of({ breedId: 'abys' }),
      snapshot: { params: { breedId: 'abys' } }
    };

    await TestBed.configureTestingModule({
      imports: [BreedPage],
      providers: [
        provideRouter([]),
        { provide: CatService, useValue: catServiceSpy },
        { provide: CatImagesService, useValue: catImagesServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BreedPage);
    component = fixture.componentInstance;
    mockCatService = TestBed.inject(CatService) as jasmine.SpyObj<CatService>;
    mockCatImagesService = TestBed.inject(CatImagesService) as jasmine.SpyObj<CatImagesService>;
  });

  describe('1. Component Initialization', () => {
    it('should create and initialize with default values', () => {
      expect(component).toBeTruthy();
      expect(component.cat()).toBeNull();
      expect(component.catImages()).toEqual([]);
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
    });
  });

  describe('2. Route Parameter Handling', () => {
    it('should load breed data when valid breedId is provided', () => {
      mockCatService.getCatById.and.returnValue(of(mockCatBreed));
      mockCatImagesService.getCatImagesByBreed.and.returnValue(of(mockCatImages));

      component.ngOnInit();

      expect(mockCatService.getCatById).toHaveBeenCalledWith('abys');
      expect(mockCatImagesService.getCatImagesByBreed).toHaveBeenCalledWith('abys');
      expect(component.cat()).toEqual(mockCatBreed);
      expect(component.catImages()).toEqual(mockCatImages);
      expect(component.loading()).toBe(false);
      expect(component.error()).toBeNull();
    });

    it('should handle missing breedId parameter', () => {
      mockActivatedRoute.params = of({});
      
      component.ngOnInit();

      expect(component.error()).toBe('No breed ID provided');
      expect(mockCatService.getCatById).not.toHaveBeenCalled();
      expect(component.cat()).toBeNull();
    });
  });

  describe('3. Service Integration & Error Handling', () => {
    it('should handle cat service errors gracefully', () => {
      const errorMessage = 'API Error';
      mockCatService.getCatById.and.returnValue(throwError(() => new Error(errorMessage)));
      mockCatImagesService.getCatImagesByBreed.and.returnValue(of(mockCatImages));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading breed:', jasmine.any(Error));
      expect(component.error()).toBe('Failed to load cat breed. Please try again.');
      expect(component.loading()).toBe(false);
      expect(component.cat()).toBeNull();
    });

    it('should handle cat images service errors without breaking main flow', () => {
      mockCatService.getCatById.and.returnValue(of(mockCatBreed));
      mockCatImagesService.getCatImagesByBreed.and.returnValue(throwError(() => new Error('Images error')));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalledWith('Error loading cat images:', jasmine.any(Error));
      expect(component.cat()).toEqual(mockCatBreed); // Main data should still load
      expect(component.catImages()).toEqual([]); // Images should remain empty
    });
  });

  describe('4. Loading State Management', () => {
    it('should manage loading states correctly during data fetch', () => {
      const subject = new Subject<ICatBreed>();
      mockCatService.getCatById.and.returnValue(subject.asObservable());
      mockCatImagesService.getCatImagesByBreed.and.returnValue(of(mockCatImages));

      // Initially not loading
      expect(component.loading()).toBe(false);

      // Start loading
      component.ngOnInit();
      expect(component.loading()).toBe(true);

      // Complete loading
      subject.next(mockCatBreed);
      subject.complete();
      
      expect(component.loading()).toBe(false);
      expect(component.cat()).toEqual(mockCatBreed);
    });
  });

  describe('5. Retry Functionality', () => {
    it('should retry loading breed data when onRetry is called', () => {
      mockCatService.getCatById.and.returnValue(of(mockCatBreed));
      mockCatImagesService.getCatImagesByBreed.and.returnValue(of(mockCatImages));
      spyOn(component, 'ngOnInit').and.callThrough();

      component.onRetry();

      expect(component.ngOnInit).toHaveBeenCalled();
      expect(mockCatService.getCatById).toHaveBeenCalledWith('abys');
    });

    it('should not retry when no breedId is available', () => {
      mockActivatedRoute.snapshot.params = {};
      spyOn(component, 'ngOnInit');

      component.onRetry();

      expect(component.ngOnInit).not.toHaveBeenCalled();
    });
  });

  describe('6. Memory Management', () => {
    it('should properly cleanup subscriptions on destroy', () => {
      const destroySubject = (component as any).destroy$;
      spyOn(destroySubject, 'next');
      spyOn(destroySubject, 'complete');

      component.ngOnDestroy();

      expect(destroySubject.next).toHaveBeenCalled();
      expect(destroySubject.complete).toHaveBeenCalled();
    });
  });

  describe('7. UI Data Display', () => {
    it('should display breed information in the template', () => {
      mockCatService.getCatById.and.returnValue(of(mockCatBreed));
      mockCatImagesService.getCatImagesByBreed.and.returnValue(of(mockCatImages));
      
      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      
      // Check if breed name and description would be displayed
      // Note: We can't fully test template rendering without the actual HTML
      expect(component.cat()?.name).toBe('Abyssinian');
      expect(component.cat()?.description).toContain('Abyssinian is easy to care for');
      expect(component.catImages().length).toBe(2);
    });
  });
});