import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonDetailsComponent } from './pokemon-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { PokeapiServices } from '../../core/services/pokeapi.services';

describe('PokemonDetailsComponent', () => {
  let component: PokemonDetailsComponent;
  let fixture: ComponentFixture<PokemonDetailsComponent>;
  let mockPokeApi: jasmine.SpyObj<PokeapiServices>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPokeApi = jasmine.createSpyObj('PokeapiServices', [
      'getPokemonById',
      'getPokemonSpecies',
      'getPokemonEncounters'
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPokeApi.getPokemonById.and.returnValue(of({
      base_experience: 100,
      name: 'pikachu',
      height: 4,
      weight: 60,
      stats: [
        { stat: { name: 'hp' }, base_stat: 35 },
        { stat: { name: 'attack' }, base_stat: 55 },
        { stat: { name: 'defense' }, base_stat: 40 },
        { stat: { name: 'speed' }, base_stat: 90 }
      ],
      sprites: {
        front_default: 'default.png',
        other: {
          'official-artwork': {
            front_default: 'official.png'
          },
          showdown: {
            front_shiny: 'shiny.png'
          }
        }
      },
      types: [
        { type: { name: 'electric' } }
      ],
      species: {
        name: 'pikachu',
        url: 'species-url'
      },
      specie: 'pikachu'
    }));


    await TestBed.configureTestingModule({
      imports: [PokemonDetailsComponent],
      providers: [
        { provide: PokeapiServices, useValue: mockPokeApi },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '25' }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PokemonDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch Pokémon data on init', () => {
    const responseMock: any = {
      base_experience: 112,
      name: 'pikachu',
      height: 4,
      weight: 60,
      stats: [
        { stat: { name: 'hp' }, base_stat: 35 },
        { stat: { name: 'attack' }, base_stat: 55 },
        { stat: { name: 'defense' }, base_stat: 40 },
        { stat: { name: 'speed' }, base_stat: 90 }
      ],
      sprites: {
        front_default: 'front.png',
        other: {
          'official-artwork': { front_default: 'official.png' },
          showdown: { front_shiny: 'shiny.png' }
        }
      },
      types: [{ type: { name: 'electric' } }],
      species: { url: 'species-url' }
    };

    mockPokeApi.getPokemonById.and.returnValue(of(responseMock));
    fixture.detectChanges();

    expect(mockPokeApi.getPokemonById).toHaveBeenCalledWith(25);
    expect(component.pokemonItem?.name).toBe('pikachu');
    expect(component.pokemonItem?.attack).toBe(55);
    expect(component.artworkUrl).toBe('official.png');
    expect(component.showdownUrl).toBe('shiny.png');
  });

  it('should toggle showMore and fetch extra info once', () => {
    component.pokemonItem = {
      id: 25,
      base_experience: 112,
      name: 'pikachu',
      specie: 'pikachu',
      sprites: {
        front_default: '',
        other: {
          'official-artwork': { front_default: '' },
          showdown: { front_shiny: '' }
        }
      },
      hp: 35,
      attack: 55,
      defense: 40,
      speed: 90,
      height: 4,
      weight: 60,
      species: { url: 'species-url', name: 'pikachu' },
      type: 'electric'
    };

    mockPokeApi.getPokemonSpecies.and.returnValue(of({
      name: 'pikachu',
      is_legendary: false,
      is_mythical: false,
      base_happiness: 70,
      capture_rate: 190
    }));
    mockPokeApi.getPokemonEncounters.and.returnValue(of([]));

    component.toggleShowMore();

    expect(component.isShowMore).toBeTrue();
    expect(mockPokeApi.getPokemonSpecies).toHaveBeenCalled();
    expect(mockPokeApi.getPokemonEncounters).toHaveBeenCalled();
    expect(component.extraInfo?.species.name).toBe('pikachu');
  });

  it('should not fetch extra info again if already loaded', () => {
    component.extraInfo = {
      species: {
        name: 'pikachu',
        is_legendary: false,
        is_mythical: false,
        base_happiness: 70,
        capture_rate: 190
      },
      location: []
    };

    component.toggleShowMore();
    expect(mockPokeApi.getPokemonSpecies).not.toHaveBeenCalled();
  });

  it('should navigate back on goBack()', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should format location correctly', () => {
    expect(component.formatLocation('power-plant')).toBe('power plant');
  });
});
