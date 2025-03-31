import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PokemonListItemsResponse, PokemonResponse } from '../../models/pokemon-list.model';

@Injectable({
  providedIn: 'root'
})

export class PokeapiServices {
  // Basic Endpoint Root
  private readonly baseUrl = "https://pokeapi.co/api/v2/";
  urlObject = "pokemon";

  constructor(private http: HttpClient) {}

  getPokemonList(offset: number, limit: number): Observable<PokemonListItemsResponse> {
    const url = `${this.baseUrl}${this.urlObject}?offset=${offset}&limit=${limit}`;
    return this.http.get<PokemonListItemsResponse>(url);
  }

  getPokemonById(id: number): Observable<PokemonResponse> {
    const url = `${this.baseUrl}${this.urlObject}/${id}`;
    return this.http.get<PokemonResponse>(url);
  }
}
