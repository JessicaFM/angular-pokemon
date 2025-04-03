import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeapiServices } from '../../core/services/pokeapi.services';
import { Pokemon, PokemonResponse, Species, Location } from '../../models/pokemon-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-pokemon-details',
  imports: [ CommonModule ],
  templateUrl: './pokemon-details.component.html',
  styleUrl: './pokemon-details.component.scss'
})

export class PokemonDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  pokeapiServices: PokeapiServices = inject(PokeapiServices);
  pokemonItem?: Pokemon;
  isShowMore: boolean = false;
  isLoading:boolean = true;
  notFound:boolean = false;
  extraInfo?: {
    species: Species,
    location: Location[]
  }

  constructor(private router: Router) {
    const pokemonId = Number(this.route.snapshot.params['id']);

    // Call for pokemon info
    this.pokeapiServices.getPokemonById(pokemonId).subscribe({
      next: (response: PokemonResponse) => {
        const { front_default, other } = response.sprites;
        const hp = response.stats.find(stat => stat.stat.name === 'hp')?.base_stat ?? 0;
        const attack = response.stats.find(stat => stat.stat.name === 'attack')?.base_stat ?? 0;
        const defense = response.stats.find(stat => stat.stat.name === 'defense')?.base_stat ?? 0;
        const speed = response.stats.find(stat => stat.stat.name === 'speed')?.base_stat ?? 0;
        const type = response.types[0].type.name;

        // Data is loading
        this.isLoading = false;

        // Build pokemon object
        this.pokemonItem = {
          id: pokemonId,
          base_experience: response.base_experience,
          name: response.name,
          specie: response.name,
          sprites: {
            front_default,
            other: {
              ['official-artwork']: other?.['official-artwork']
                ? {
                    front_default: other['official-artwork'].front_default
                  }
                : undefined,
              showdown: other?.showdown
                ? {
                    front_shiny: other.showdown.front_shiny
                  }
                : undefined
            }
          },
          hp,
          attack,
          defense,
          speed,
          height: response.height,
          weight: response.weight,
          species: response.species,
          type: type
        }
      },
      error: (err) => {
        // If there is any error on api callback / object build
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }

  // Reverse Card
  toggleShowMore() {
    this.isShowMore = !this.isShowMore;

    // Load extra data for card back info
    if (this.isShowMore && !this.extraInfo && this.pokemonItem) {
      const id = this.pokemonItem.id;

      forkJoin({
        species: this.pokeapiServices.getPokemonSpecies(this.pokemonItem.species.url),
        locations: this.pokeapiServices.getPokemonEncounters(id)
      }).subscribe(({ species, locations }) => {
        this.extraInfo = {
          species,
          location: locations as Location[]
        };
      });
    }
  }

  // Return to home (list)
  goBack() {
    this.router.navigate(['']);
  }

  // Format string for pokemon locations
  formatLocation(name: string): string {
    return name.replace(/-/g, ' ');
  }

  // Get Pokemon artwork image if it exist, else show default image -> pokeball
  get artworkUrl(): string {
    return (
      this.pokemonItem?.sprites?.other?.['official-artwork']?.front_default ||
      this.pokemonItem?.sprites?.front_default ||
      'pokeball.png'
    );
  }

  // Get showdown pokemon image if exists, else sho default image -> pokeball
  get showdownUrl(): string {
    return (
      this.pokemonItem?.sprites?.other?.showdown?.front_shiny ||
      'pokeball.png'
    )
  }
}

