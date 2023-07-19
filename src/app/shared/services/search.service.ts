import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchResults: string[] = [];
  searchResultsChanged: Subject<string[]> = new Subject<string[]>();


  /**
   * The setSearchResults() method allows other components to set the search results, ...
   * ... and the getSearchResults() method retrieves the search results.
   * @param results
   */
  setSearchResults(results: string[]): void {
    this.searchResults = results;
  }


  getSearchResults(): string[] {
    return this.searchResults;
  }
}
