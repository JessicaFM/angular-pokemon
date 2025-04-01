import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonListComponent } from './pokemon-list.component';
import { PokemonStoreService } from '../../core/services/pokemon-store.service';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('PokemonListComponent', () => {
  let component: PokemonListComponent;
  let fixture: ComponentFixture<PokemonListComponent>;
  let mockStore: jasmine.SpyObj<PokemonStoreService>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj('PokemonStoreService', [
      'goToPage',
      'previousPage',
      'nextPage',
      'getPages'
    ], {
      currentPage$: of(1),
      pokemonList$: of({
        list: [
          { name: 'pikachu', image: 'pikachu.png', base_experience: 112, id: 25 },
          { name: 'bulbasaur', image: 'bulbasaur.png', base_experience: 64, id: 1 }
        ],
        currentPage: 1,
        total: 100,
        pageSize: 10
      }),
      pokemonListAll$: of([]),
      searchTerm$: of('')
    });

    await TestBed.configureTestingModule({
      imports: [PokemonListComponent],
      providers: [
        {
          provide: PokemonStoreService,
          useValue: mockStore
        },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should go to specific page', () => {
    component.goToPage(3);
    expect(mockStore.goToPage).toHaveBeenCalledWith(3);
  });

  it('should go to previous page', () => {
    component.previousPage();
    expect(mockStore.previousPage).toHaveBeenCalled();
  });

  it('should go to next page with total', () => {
    component.nextPage(120);
    expect(mockStore.nextPage).toHaveBeenCalledWith(120);
  });

  it('should get pagination pages from store', () => {
    mockStore.getPages.and.returnValue([1, 2, 3, '...', 10]);
    const result = component.getPages(100, 10, 0);
    expect(result).toEqual([1, 2, 3, '...', 10]);
    expect(mockStore.getPages).toHaveBeenCalledWith(100, 10, 0);
  });
});
