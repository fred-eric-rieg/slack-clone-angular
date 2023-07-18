import { Component } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchTerm!: string;
  searchResults!: string[];

  /*
  items: string[] = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']; // TEST
  */
  search(): void {
    //this.searchResults = this.items.filter(item =>
     // item.toLowerCase().includes(this.searchTerm.toLowerCase())
    //);
  }
}
