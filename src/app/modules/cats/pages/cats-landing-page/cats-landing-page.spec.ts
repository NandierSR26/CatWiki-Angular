import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { CatsLandingPage } from './cats-landing-page';
import { CatService } from '../../services/cat-service.service';
import { ICatBreed } from '../../interfaces/cats.interface';

describe('CatsLandingPage Component', () => {
  let component: CatsLandingPage;
  let fixture: ComponentFixture<CatsLandingPage>;
  let mockCatService: jasmine.SpyObj<CatService>;
  let mockRouter: Router;

  const mockCatBreeds: ICatBreed[] = [
    {
      id: 'abys',
      name: 'Abyssinian',
      description: 'The Abyssinian is easy to care for.',
      temperament: 'Active, Energetic',
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
    },
    {
      id: 'aege',
      name: 'Aegean',
      description: 'Native to the Greek islands.',
      temperament: 'Affectionate, Social',
      origin: 'Greece',
      life_span: '9 - 12',
      weight: { imperial: '7 - 10', metric: '3 - 5' },
      country_codes: 'GR',
      country_code: 'GR',
      adaptability: 5,
      affection_level: 4,
      child_friendly: 4,
      dog_friendly: 4,
      energy_level: 3,
      grooming: 3,
      health_issues: 1,
      intelligence: 3,
      shedding_level: 3,
      social_needs: 4,
      stranger_friendly: 4,
      vocalisation: 3,
      experimental: 0,
      hairless: 0,
      natural: 0,
      rare: 0,
      rex: 0,
      suppressed_tail: 0,
      short_legs: 0,
      indoor: 0,
      wikipedia_url: 'https://en.wikipedia.org/wiki/Aegean_cat',
      hypoallergenic: 0,
      reference_image_id: 'ozEvzdVM-',
      image: {
        id: 'ozEvzdVM-',
        width: 1200,
        height: 800,
        url: 'https://cdn2.thecatapi.com/images/ozEvzdVM-.jpg'
      }
    }
  ];

  beforeEach(async () => {
    const catServiceSpy = jasmine.createSpyObj('CatService', ['getCats']);

    await TestBed.configureTestingModule({
      imports: [CatsLandingPage],
      providers: [
        provideRouter([]),
        { provide: CatService, useValue: catServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CatsLandingPage);
    component = fixture.componentInstance;
    mockCatService = TestBed.inject(CatService) as jasmine.SpyObj<CatService>;
    mockRouter = TestBed.inject(Router);

    spyOn(mockRouter, 'navigate').and.returnValue(Promise.resolve(true));
  });

  describe('1. Component Initialization', () => {
    it('should create with default loading state', () => {
      expect(component).toBeTruthy();
      expect(component.carouselCats()).toEqual([]);
      expect(component.carouselCatsLoading()).toBe(true);
      expect(component.page()).toBe(0);
      expect(component.limit()).toBe(20);
    });
  });

  describe('2. Data Loading', () => {
    it('should load cat breeds on init and update loading state', () => {
      mockCatService.getCats.and.returnValue(of(mockCatBreeds));

      component.ngOnInit();

      expect(mockCatService.getCats).toHaveBeenCalled();
      expect(component.carouselCats()).toEqual(mockCatBreeds);
      expect(component.carouselCatsLoading()).toBe(false);
    });

    it('should handle empty cat breeds response', () => {
      mockCatService.getCats.and.returnValue(of([]));

      component.ngOnInit();

      expect(component.carouselCats()).toEqual([]);
      expect(component.carouselCatsLoading()).toBe(false);
    });
  });

  describe('3. Navigation Functionality', () => {
    it('should navigate to breed page with valid breedId', () => {
      spyOn(console, 'log');
      const breedId = 'abys';

      component.toBreedPage(breedId);

      expect(console.log).toHaveBeenCalledWith('Navigating to breed page for breedId:', breedId);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/cats/breed', breedId]);
    });

    it('should not navigate with empty or invalid breedId', () => {
      component.toBreedPage('');
      component.toBreedPage(null as any);
      component.toBreedPage(undefined as any);

      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  describe('4. Service Integration', () => {
    it('should call getCats service method on initialization', () => {
      mockCatService.getCats.and.returnValue(of(mockCatBreeds));

      component.ngOnInit();

      expect(mockCatService.getCats).toHaveBeenCalled();
      expect(component.carouselCats()).toEqual(mockCatBreeds);
      expect(component.carouselCatsLoading()).toBe(false);
    });
  });
});
