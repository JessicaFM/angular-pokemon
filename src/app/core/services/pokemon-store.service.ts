import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, forkJoin, map, switchMap, of, tap } from 'rxjs';
import { PokeapiServices } from './pokeapi.services';
import { PokemonListItem } from '../../models/pokemon-list.model';
@Injectable({
  providedIn: 'root'
})

export class PokemonStoreService {
  private readonly pageSize = 10;

  private readonly allPokemonsSubject = new BehaviorSubject<PokemonListItem[]>([]);
  readonly allPokemons$ = this.allPokemonsSubject.asObservable();

  // searchTerm can change store value, searchTerm$ is just readable and cannot be modified  at any point
  private searchTerm = new BehaviorSubject<string>('');
  readonly searchTerm$ = this.searchTerm.asObservable();

  private sortAsc = new BehaviorSubject<boolean>(true);
  readonly sortAsc$ = this.sortAsc.asObservable();

  private currentPage = new BehaviorSubject<number>(1);
  readonly currentPage$ = this.currentPage.asObservable();

  private loadedDetails = new Set<number>();

  pokeapiServices: PokeapiServices = inject(PokeapiServices);

  // All the pokemon list of all pokemon
  readonly pokemonListAll$ = this.pokeapiServices.getAllPokemon().pipe(
    map((response) => response.results.map((pokemon) => {
      const parts = pokemon.url.split('/');
      const id = Number(parts[parts.length - 2]);
      return {
        ...pokemon,
        id
      };
    })),
    tap((list) => {
      if (this.allPokemonsSubject.value.length === 0) {
        this.allPokemonsSubject.next(list);
      }
    })
  );

  // Combination of stores to make a new list
  readonly pokemonList$ = combineLatest([
    this.allPokemons$,
    this.searchTerm$,
    this.sortAsc$,
    this.currentPage$
  ]).pipe(
    map(([allPokemons, search, sortAsc, page]) => {
      let filtered = allPokemons.filter(p => p.name.toLowerCase().includes(search));

      filtered = filtered.sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );

      // Our custom pagination
      const start = (page - 1) * this.pageSize;
      const end = start + this.pageSize;

      // Our results filteres in pagination mode
      const paginated = filtered.slice(start, end);

      return {
        list: paginated,
        total: filtered.length,
        currentPage: page,
        pageSize: this.pageSize
      };
    })
  );

  loadMoreDetailsList(pokemon: PokemonListItem) {
    if (pokemon.image || this.loadedDetails.has(pokemon.id)) return;

    this.loadedDetails.add(pokemon.id);

    this.pokeapiServices.getPokemonById(pokemon.id).subscribe(detail => {
      const updatedItem = {
        ...pokemon,
        image: detail.sprites.front_default,
        base_experience: detail.base_experience
      };

      const allItems = [...this.allPokemonsSubject.value];
      allItems.splice(allItems.findIndex(p => p.id === pokemon.id), 1, updatedItem);
      this.allPokemonsSubject.next(allItems);
    });
  }

  // Custom searcher in pokemon list
  updateSearch(term: string) {
    if(term === '') {
      this.searchTerm.next("");
    } else {
      this.searchTerm.next(term.toLowerCase());
    }
    this.currentPage.next(1);
  }

  toggleSort() {
    this.sortAsc.next(!this.sortAsc.value);
  }

  goToPage(page: number) {
    this.currentPage.next(page);
  }

  previousPage() {
    const current = this.currentPage.value;
    if (current > 1) this.currentPage.next(current - 1);
  }

  nextPage(totalItems: number) {
    const totalPages = Math.ceil(totalItems / this.pageSize);
    const current = this.currentPage.value;
    if (current < totalPages) this.currentPage.next(current + 1);
  }

  getPages(total: number, pageSize: number, currentPage: number): (number | '...')[] {
    const totalPages = Math.ceil(total / pageSize);
    const pages: (number | '...')[] = [];
    const maxVisible = 3;
    const lastPageToShow = Math.min(currentPage + (maxVisible - 1), totalPages);

    for (let i = currentPage; i <= lastPageToShow; i++) {
      pages.push(i);
    }

    if (lastPageToShow < totalPages - 1) {
      pages.push('...');
      pages.push(totalPages);
    } else if (lastPageToShow < totalPages) {
      pages.push(totalPages);
    }

    return pages;
  }
}
