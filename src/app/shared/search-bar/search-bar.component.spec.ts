import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { PokemonStoreService } from '../../core/services/pokemon-store.service';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let mockStore: jasmine.SpyObj<PokemonStoreService>;

  beforeEach(async () => {
    mockStore = jasmine.createSpyObj(
      'PokemonStoreService',
      ['updateSearch'],
      { searchTerm$: of('pikachu') }
    );

    await TestBed.configureTestingModule({
      imports: [SearchBarComponent],
      providers: [
        {
          provide: PokemonStoreService,
          useValue: mockStore,
        },
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize search from store', async() => {
    expect(component.currentSearch).toBe('pikachu')
  });

  it('should update searcher on input', () => {
    const inputEvent = {
      target: { value: 'charizard' }
    } as unknown as Event;

    component.onInput(inputEvent);
    expect(mockStore.updateSearch).toHaveBeenCalledWith('charizard');
  });
});
