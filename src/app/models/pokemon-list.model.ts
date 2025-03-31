export interface PokemonListItemsResponse {
  count: number;
  results: PokemonListItem[]
}

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
}

export interface PokemonResponse {
  base_experience: number;
  name: string;
  specie: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat:{
      name: string;
    }
  }[];
  height: number;
  weight: number;
}

export interface Pokemon {
  base_experience: number;
  name: string;
  specie: string;
  image: string;
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
}
