// Interface for maping general pokemon data result
export interface PokemonListItemsResponse {
  count: number;
  results: PokemonListItem[]
}

// Interface for pokemon object list
export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
  base_experience: number;
}

// Interface for mapping single pokemon data result
export interface PokemonResponse {
  id: number,
  base_experience: number;
  name: string;
  specie: string;
  sprites: {
    front_default: string;
    other: {
      ['official-artwork']?: {
        front_default: string;
      };
      showdown?: {
        front_shiny: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat:{
      name: string;
    }
  }[];
  height: number;
  weight: number;
  species: {
    name: string;
    url: string;
  }
  types: [
    {
      type: {
        name: string
      }
    }
  ];
}

// Interface for mapping pokemon object
export interface Pokemon {
  id: number;
  base_experience: number;
  name: string;
  specie: string;
  sprites: {
    front_default: string;
    other: {
      ['official-artwork']?: {
        front_default: string;
      };
      showdown?: {
        front_shiny: string;
      };
    };
  };
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  height: number;
  weight: number;
  species: {
    name: string;
    url: string;
  }
  type: string;
}

// Interface for mapping pokemon species data than we like to show
export interface Species {
  name: string;
  base_happiness: number;
  capture_rate: number;
  is_legendary: boolean;
  is_mythical: boolean;
}

// Interface for mapping pokemon locations data
export interface Location {
  location_area: {
    name: string;
  }
}
