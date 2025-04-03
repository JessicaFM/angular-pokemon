import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PokemonStoreService } from '../../core/services/pokemon-store.service';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-pokemonlist',
  imports: [ CommonModule, RouterModule, SearchBarComponent ],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.scss'
})

export class PokemonListComponent {
  readonly pokemonList$;
  readonly currentPage$;
  isLoading:boolean = true;
  hasImageError:boolean = false;

  constructor(public store: PokemonStoreService) {
    this.currentPage$ = this.store.currentPage$;
    this.pokemonList$ = this.store.pokemonList$;
    this.store.pokemonListAll$.subscribe();
    this.store.searchTerm$.subscribe();
  }

  // While image is loading
  onImageLoad() {
    this.isLoading = false;
  }

  // If there is any error
  onImageError() {
    this.isLoading = false;
    this.hasImageError = true;
  }

  // Pagination: to to selected page
  goToPage(page: number) {
    this.store.goToPage(page);
  }

  // Pagination: Go to previous page
  previousPage() {
    this.store.previousPage();
  }

  // Pagination: go to next page
  nextPage(total: number) {
    this.store.nextPage(total);
  }

  // Pagination: get pages to show in template
  getPages(total: number, limit: number, offset: number): (number | '...')[] {
    return this.store.getPages(total, limit, offset)
  }
}
