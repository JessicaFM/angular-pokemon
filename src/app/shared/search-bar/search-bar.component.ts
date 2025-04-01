import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonStoreService } from '../../core/services/pokemon-store.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})

export class SearchBarComponent {
  currentSearch = '';

  constructor(public store: PokemonStoreService) {
    firstValueFrom(this.store.searchTerm$).then(term => {
      this.currentSearch = term;
    });
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.store.updateSearch(input.value);
  }
}
