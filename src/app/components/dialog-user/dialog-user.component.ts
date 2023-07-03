import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData } from '@angular/fire/firestore';
import { User } from 'src/models/user.class';
import { DialogUserEditComponent } from '../dialog-user-edit/dialog-user-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { SidenavService } from './../../shared/services/sidenav.service';
import { AuthService } from 'src/app/shared/services/auth.service';
//import { AngularFireStorage } from '@angular/fire/storage';
// import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {
  users: any;
  userId: string = '';
  user: User = new User();
  isSidenavHidden = false;
  imgUrl: string = ''; // TEST


  constructor(
    public firestore: Firestore,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public sidenavService: SidenavService,
    public authService: AuthService,
    //private storage: AngularFireStorage
    // public userService: UserService,
  ) {}


  /**
   * ngOnInit is called, and the 'users' collection is fetched from Firestore.
   * The collection is converted into an Observable and stored in this.users.
   * Within the subscription, you can access the data and make a copy if needed.
   */
  ngOnInit() {
    const collectionInstance = collection(this.firestore, 'users');
    this.users = collectionData(collectionInstance);
    this.users.subscribe((data: any) => {
      console.log('Got data', data);
    });
    /**
    * Subscribes to route parameter changes and fetches user data.
    * User ID is extracted from the route parameters.
    * Fetches user data based on the retrieved user ID.
    * If no user ID is provided in the route parameters, a default user ID is used.
    */
    this.route.paramMap.subscribe(paramMap => {
      this.userId = paramMap.get('id') ?? '1EPTd99Hh1YYFjrxLPW0'; // Diese Zeile muss geändert werden!! (ID vom Login übernehmen?? Guest mit fixer ID??)
      this.getUser();
    });


    /**
     * Checks if sidenav with profile info is oppened.
     */
    this.sidenavService.sidenavOpened.subscribe(() => {
      this.isSidenavHidden = false;
    });
  }


  /**
   * Retrieves user data from Firestore based on the provided user ID.
   * Subscribes to the document data and maps it to a User object.
   * 'userCollection' is a firestore collection representing the 'users' collection.
   * 'docRef' is a document reference representing a specific user document.
   */
  getUser() {
    const userCollection = collection(this.firestore, 'users');
    const docRef = doc(userCollection, this.userId);

    docData(docRef).subscribe((userCollection: any) => {
      this.user = new User(userCollection);
    });
  }


  uploadImage(): void {
    /*
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files[0];
      const filePath = `user-profile-images/${this.userId}.jpg`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, file);

      uploadTask.percentageChanges().subscribe(percent => {
        console.log('upload progress:', percent);
      });

      try {
        const snapshot = await uploadTask.toPromise();
        const url = await snapshot.ref.getDownloadURL();
        this.imgUrl = url;
        await this.userCollection.update({ profileImageUrl: url });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };

    input.click();
    */
  }



  /**
   * Opens input fields to edit user info.
   */
  openDialogUserEdit() {
    const dialog = this.dialog.open(DialogUserEditComponent);
    dialog.componentInstance.user = new User(this.user.toJson());
    dialog.componentInstance.userId = this.userId;
  }


  /**
   * Closes Sidenav with profile information
   */
  closeSidenav() {
    this.isSidenavHidden = true;
  }
}
