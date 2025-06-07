import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokeapiServices } from '../../core/services/pokeapi.services';
import { Pokemon, PokemonResponse } from '../../models/pokemon-list.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-pokemon-battle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-battle.component.html',
  styleUrl: './pokemon-battle.component.scss'
})
export class PokemonBattleComponent {
  route = inject(ActivatedRoute);
  pokeapi = inject(PokeapiServices);

  playerPokemon?: Pokemon;
  opponentPokemon?: Pokemon;
  isLoading = true;
  notFound = false;
  battleStarted: boolean = false;
  currentTurn: 'player' | 'opponent' | null = null;
  winner: string | null = null;

  // Puntos de vida
  playerHP: number = 0;
  opponentHP: number = 0;
  battleLog: string[] = [];
  isBusy: boolean = false;
  actionLabel: string = 'You Attack';



  constructor(private cdr: ChangeDetectorRef, private router: Router) {
    const id = Number(this.route.snapshot.params['id']);
    this.loadBattle(id);
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.loadBattle(id);
      } else {
        this.notFound = true;
        this.isLoading = false;
      }
    });
  }

  loadBattle(id: number) {
    // Get random opponent between 1 and 898 (current range of national Pokédex)
    const opponentId = Math.floor(Math.random() * 898) + 1;

    Promise.all([
      this.pokeapi.getPokemonById(id).toPromise(),
      this.pokeapi.getPokemonById(opponentId).toPromise()
    ])
    .then(([playerResponse, opponentResponse]) => {
      if (!playerResponse || !opponentResponse) {
        this.notFound = true;
        this.isLoading = false;
        return;
      }

      this.playerPokemon = this.buildPokemon(playerResponse);
      this.opponentPokemon = this.buildPokemon(opponentResponse);
      this.isLoading = false;

       // Asignar HP inicial basado en el stat original del Pokémon
      this.playerHP = this.playerPokemon.hp;
      this.opponentHP = this.opponentPokemon.hp;
    })
    .catch(() => {
      this.notFound = true;
      this.isLoading = false;
    });
  }

  buildPokemon(response: PokemonResponse): Pokemon {
    const hp = response.stats.find(stat => stat.stat.name === 'hp')?.base_stat ?? 0;
    const attack = response.stats.find(stat => stat.stat.name === 'attack')?.base_stat ?? 0;
    const defense = response.stats.find(stat => stat.stat.name === 'defense')?.base_stat ?? 0;
    const speed = response.stats.find(stat => stat.stat.name === 'speed')?.base_stat ?? 0;
    const type = response.types[0].type.name;

    return {
      id: response['id'],
      name: response.name,
      base_experience: response.base_experience,
      specie: response.name,
      sprites: {
        front_default: response.sprites.front_default,
        other: {
          ['official-artwork']: response.sprites.other?.['official-artwork']
            ? {
                front_default: response.sprites.other['official-artwork'].front_default
              }
            : undefined,
          showdown: response.sprites.other?.showdown
            ? {
                front_shiny: response.sprites.other.showdown.front_shiny
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
      type
    };
  }


  getImage(pokemon?: Pokemon): string {
    return pokemon?.sprites?.other?.['official-artwork']?.front_default ||
      pokemon?.sprites?.front_default ||
      'pokeball.png';
  }

  startBattle(): void {
    if (!this.playerPokemon || !this.opponentPokemon || this.battleStarted) return;

    this.winner = null;
    this.battleStarted = true;

    this.currentTurn = Math.random() < 0.5 ? 'player' : 'opponent';

    this.pokemonAttack();
  }


  calculateDamage(attacker: Pokemon, defender: Pokemon): number {
    const level = 50;
    const power = 40;

    const base = ((2 * level / 5 + 2) * attacker.attack * power) / defender.defense;
    const damage = Math.floor(base / 50) + 2;

    const variation = Math.floor(damage * (Math.random() * 0.2 - 0.1));
    return Math.max(1, damage + variation);
  }

  pokemonAttack(): void {
  if (!this.opponentPokemon || !this.playerPokemon || this.winner || this.isBusy) return;

  this.isBusy = true;

  if (this.currentTurn === 'player') {
    const damage = this.calculateDamage(this.playerPokemon, this.opponentPokemon);
    this.opponentHP = Math.max(0, this.opponentHP - damage);

    this.paintMessage(`${this.playerPokemon.name.toUpperCase()} attacked with ${damage} damage`);

    if (this.opponentHP <= 0) {
      this.winner = 'You win!';
      this.isBusy = false;
      this.currentTurn = null;
      this.actionLabel = 'Game Over';
    } else {
      this.currentTurn = 'opponent';
      this.actionLabel = "Opponent's turn";
      this.isBusy = false;
    }

  } else if (this.currentTurn === 'opponent') {
    const damage = this.calculateDamage(this.opponentPokemon, this.playerPokemon);
    this.paintMessage(`${this.opponentPokemon.name.toUpperCase()} attacked you with ${damage} damage`);

    setTimeout(() => {
      this.playerHP = Math.max(0, this.playerHP - damage);

      if (this.playerHP <= 0) {
        this.winner = 'You lose!';
        this.currentTurn = null;
        this.actionLabel = 'Game Over';
      } else {
        this.currentTurn = 'player';
        this.actionLabel = 'You Attack';
      }

      this.isBusy = false;
    }, 1000);
  }
}



  setBusy(value: boolean) {
    this.isBusy = value;
    this.cdr.detectChanges();
  }

  opponentAttack(): void {
    // Because typescript...
    if (!this.opponentPokemon || !this.playerPokemon) return;

    const damage = this.calculateDamage(this.opponentPokemon, this.playerPokemon);
    this.playerHP = Math.max(0, this.playerHP - damage);

    this.paintMessage(`${this.opponentPokemon.name.toUpperCase()} attacked you with ${damage} damage`)

    if (this.playerHP <= 0) {
      this.winner = '';
      this.paintMessage('You lose!');
      this.currentTurn = null;
    } else {
      this.currentTurn = 'player';
    }
  }

  playerAttack(): void {
    // Because typescript...
    if (!this.opponentPokemon || !this.playerPokemon) return;

    const damage = this.calculateDamage(this.playerPokemon, this.opponentPokemon);
    this.opponentHP = Math.max(0, this.opponentHP - damage);

    this.paintMessage(`${this.playerPokemon.name.toUpperCase()} attacked with ${damage} damage`)

    if (this.opponentHP <= 0) {
      this.winner = '';
      this.paintMessage(`You win!`);
      this.currentTurn = null;
    } else {
      this.currentTurn = 'opponent';
      setTimeout(() => {
        this.pokemonAttack();
      }, 1500);
    }
  }

  restartBattle(): void {
    this.winner = null;
    this.battleLog = [];
    this.battleStarted = false;
    this.currentTurn = null;

    // Reset HP
    this.playerHP = this.playerPokemon?.hp ?? 0;

    // Generate a new random opponent (optional)
    const randomId = Math.floor(Math.random() * 898) + 1;

    this.pokeapi.getPokemonById(randomId).subscribe(opponent => {
      this.opponentPokemon = this.buildPokemon(opponent);
      this.opponentHP = this.opponentPokemon.hp;

      // Ready to battle again
      this.startBattle();
    });
  }

  paintMessage(message: string): void {
    this.battleLog.unshift(message);
  }

   // Return to home (list)
  goBack() {
    this.router.navigate(['']);
  }
}

