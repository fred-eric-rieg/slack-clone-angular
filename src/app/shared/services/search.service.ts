import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchResults: string[] = [];

  setSearchResults(results: string[]): void {
    this.searchResults = results;
  }

  getSearchResults(): string[] {
    return this.searchResults;
  }
}
