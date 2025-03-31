import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { PokemonListComponent } from './features/pokemon-list/pokemon-list.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    PokemonListComponent,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-pokemon';
}
