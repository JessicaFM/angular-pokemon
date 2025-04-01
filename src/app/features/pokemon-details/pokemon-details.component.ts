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
  extraInfo?: {
    species: Species,
    location: Location[]
  }

  constructor(private router: Router) {
    const pokemonId = Number(this.route.snapshot.params['id']);

    this.pokeapiServices.getPokemonById(pokemonId).subscribe((response: PokemonResponse) => {
      const { front_default, other } = response.sprites;
      const hp = response.stats.find(stat => stat.stat.name === 'hp')?.base_stat ?? 0;
      const attack = response.stats.find(stat => stat.stat.name === 'attack')?.base_stat ?? 0;
      const defense = response.stats.find(stat => stat.stat.name === 'defense')?.base_stat ?? 0;
      const speed = response.stats.find(stat => stat.stat.name === 'speed')?.base_stat ?? 0;

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
        species: response.species
      }
    })
  }

  toggleShowMore() {
    this.isShowMore = !this.isShowMore;

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

  goBack() {
    this.router.navigate(['']);
  }

  formatLocation(name: string): string {
    return name.replace(/-/g, ' ');
  }

  get artworkUrl(): string {
    return (
      this.pokemonItem?.sprites?.other?.['official-artwork']?.front_default ||
      this.pokemonItem?.sprites?.front_default ||
      'pokeball.png'
    );
  }

  get showdownUrl(): string {
    return (
      this.pokemonItem?.sprites?.other?.showdown?.front_shiny ||
      'pokeball.png'
    )
  }

}

