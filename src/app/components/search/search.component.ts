import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchTerm: string = ''; // linked to input
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>(); // EventEmitter requires Output


  /**
   * The search-Function is triggered when the user types in the search input field.
   * It emits the 'searchTerm'-value using the 'searchEvent'-emitter.
   * The parent component ('toolbar') can then listen to this event and handle the search functionality accordingly.
   */
  search(): void {
    this.searchEvent.emit(this.searchTerm);
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchEvent.emit('');
  }
}
