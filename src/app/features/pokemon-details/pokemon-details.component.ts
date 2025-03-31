import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeapiServices } from '../../core/services/pokeapi.services';
import { Pokemon, PokemonResponse } from '../../models/pokemon-list.model';
import { ActivatedRoute } from '@angular/router';

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

  constructor() {
    const pokemonId = Number(this.route.snapshot.params['id']);

    console.log("Im in pokemon");

    this.pokeapiServices.getPokemonById(pokemonId).subscribe((response: PokemonResponse) => {
      console.log(response)

      const image = response.sprites?.front_default;
      const hp = response.stats.find(stat => stat.stat.name === 'hp')?.base_stat ?? 0;
      const attack = response.stats.find(stat => stat.stat.name === 'attack')?.base_stat ?? 0;
      const defense = response.stats.find(stat => stat.stat.name === 'defense')?.base_stat ?? 0;
      const speed = response.stats.find(stat => stat.stat.name === 'speed')?.base_stat ?? 0;

      this.pokemonItem = {
        base_experience: response.base_experience,
        name: response.name,
        specie: response.name,
        image: image ?? '',
        hp,
        attack,
        defense,
        speed,
        height: response.height,
        weight: response.weight
      }
    })
  }

}

