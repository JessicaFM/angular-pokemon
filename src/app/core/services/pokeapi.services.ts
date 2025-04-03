import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonListItemsResponse, PokemonResponse, Species, Location } from '../../models/pokemon-list.model';

@Injectable({
  providedIn: 'root'
})

export class PokeapiServices {
  // Basic Endpoint Root
  private readonly baseUrl = "https://pokeapi.co/api/v2/";

  // Objexts to search
  urlPokemonObject = "pokemon";
  urlPokemonEncounters = "encounters";

  constructor(private http: HttpClient) {}

  // All pokemons to build home list
  getAllPokemon(): Observable<PokemonListItemsResponse> {
    const url = `${this.baseUrl}${this.urlPokemonObject}?limit=1300&offset=0.`;
    return this.http.get<PokemonListItemsResponse>(url);
  }

  // Endpoint to get specific pokemon by it ID
  getPokemonById(id: number): Observable<PokemonResponse> {
    const url = `${this.baseUrl}${this.urlPokemonObject}/${id}`;
    return this.http.get<PokemonResponse>(url);
  }

  // Endpoint to get species data. It comes from details object from getPokemonById
  getPokemonSpecies(url: string): Observable<Species> {
    return this.http.get<Species>(url);
  }

  // Endpoint to get location of pokemon
  getPokemonEncounters(id: number): Observable<Location[]> {
    const url = `${this.baseUrl}pokemon/${id}/${this.urlPokemonEncounters}`;
    return this.http.get<Location[]>(url);
  }
}
