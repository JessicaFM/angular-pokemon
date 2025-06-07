import { Routes } from '@angular/router';
import { PokemonListComponent } from './features/pokemon-list/pokemon-list.component';
import { PokemonDetailsComponent } from './features/pokemon-details/pokemon-details.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

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
  },
  {
    path: 'battle/:id',
    loadComponent: () => import('./features/pokemon-battle/pokemon-battle.component').then(m => m.PokemonBattleComponent),
    title: 'Pokemon battle'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found'
  }
];
