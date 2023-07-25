import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelpComponent } from '../dialog-help/dialog-help.component';
import { DialogLegalComponent } from '../dialog-legal/dialog-legal.component';
import { SidenavService } from 'src/app/shared/services/sidenav.service';
// import { User } from 'src/models/user.class';
// Import des AngularFireAuth Service
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ChannelService } from 'src/app/shared/services/channel.service';
import { SearchService } from './../../shared/services/search.service';


@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  @Output() sidenavOpened = new EventEmitter<boolean>();


  constructor(public dialog: MatDialog,
    public asService: AngularFireAuth,
    private sidenavService: SidenavService,
    private router: Router,
    public channelService: ChannelService,
    public searchService: SearchService,
    ) {}


  onSearchText(searchTerm: string): void {
    const searchResults = [searchTerm];
    this.searchService.setSearchResults(searchResults);
    console.log(searchResults);
  }


  openDialogHelp() {
    const dialogRef = this.dialog.open(DialogHelpComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  openDialogLegal() {
    const dialogRef = this.dialog.open(DialogLegalComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  openUserProfile() {
    this.sidenavService.sidenavOpened.emit(false);
  }


  openLeftSidenav() {
    this.sidenavService.leftSidenavOpened.emit();
  }


  logoutUser() {
    this.asService.signOut();
    this.router.navigate(['']);
  }
}
