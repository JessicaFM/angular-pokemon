import { Routes } from '@angular/router';
import { PokemonListComponent } from './features/pokemon-list/pokemon-list.component';
import { PokemonDetailsComponent } from './features/pokemon-details/pokemon-details.component';

export const routes: Routes = [
  {
    path: '',
    component: PokemonListComponent,
    title: 'Pokemon List'
  },
  {
    path: 'details/:id',
    component: PokemonDetailsComponent,
    title: 'Pokemon Detail'
  }
];
