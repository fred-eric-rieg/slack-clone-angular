import { Component } from '@angular/core';

@Component({
  selector: 'app-dialog-add-description',
  templateUrl: './dialog-add-description.component.html',
  styleUrls: ['./dialog-add-description.component.scss']
})
export class DialogAddDescriptionComponent {

  dialogData = {
    description: '',
  };
}
