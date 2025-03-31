import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeapiServices } from '../../core/services/pokeapi.services';
import { PokemonListItem } from '../../models/pokemon-list.model';
import { PokemonListItemsResponse } from '../../models/pokemon-list.model';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, switchMap, map } from 'rxjs';

@Component({
  selector: 'app-pokemonlist',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})

export class PokemonListComponent {
  private pagination = new BehaviorSubject<{ offset: number; limit: number }>({
    offset: 0,
    limit: 10
  });

  pokeapiServices: PokeapiServices = inject(PokeapiServices);
  pokemonsList: PokemonListItem[] = [];
  pokemonsListFiltered: PokemonListItem[] = [];


  readonly pokemonList$ = this.pagination.pipe(
    switchMap(({ offset, limit }) =>
      this.pokeapiServices.getPokemonList(offset, limit).pipe(
        map((response) => {
          const list = response.results.map((pokemon) => {
            const parts = pokemon.url.split('/');
            const id = Number(parts[parts.length - 2]);
            return {
              ...pokemon,
              id
            };
          });

          return {
            list,
            offset,
            limit,
            total: response.count
          }
        })
      )
    )
  );

  readonly currentPage$ = this.pagination.pipe(
    map(({ offset, limit }) => Math.floor(offset / limit) + 1)
  );

  previousPage(offset: number, limit: number) {
    let newOffset = offset - limit;
    if (newOffset < 0) newOffset = 0;
    this.pagination.next({ offset: newOffset, limit})
  }

  nextPage(offset: number, limit: number) {
    const newOffset = offset + limit;
    this.pagination.next({ offset: newOffset, limit });
  }

  goToPage(page: number) {
    const { limit } = this.pagination.value;
    const offset = (page - 1) * limit;
    this.pagination.next({ offset, limit });
  }

  getPages(total: number, limit: number, offset: number): (number | '...')[] {
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const maxVisible = 5;
    const pages: (number | '...')[] = [];
    const half = Math.floor(maxVisible / 2);

    let start = currentPage - half;
    let end = currentPage + half;

    if (start < 1) {
      start = 1;
      end = Math.min(maxVisible, totalPages);
    }

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  }
}
