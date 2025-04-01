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
  isLoading = true;
  hasImageError = false;

  constructor(public store: PokemonStoreService) {
    this.currentPage$ = this.store.currentPage$;
    this.pokemonList$ = this.store.pokemonList$;
    this.store.pokemonListAll$.subscribe();
    this.store.searchTerm$.subscribe();
  }

  onImageLoad() {
    this.isLoading = false;
  }

  onImageError() {
    this.isLoading = false;
    this.hasImageError = true;
  }

  goToPage(page: number) {
    this.store.goToPage(page);
  }

  previousPage() {
    this.store.previousPage();
  }

  nextPage(total: number) {
    this.store.nextPage(total);
  }

  getPages(total: number, limit: number, offset: number): (number | '...')[] {
    return this.store.getPages(total, limit, offset)
  }
}
