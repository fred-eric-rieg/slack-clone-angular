import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/models/user.class';
import { Firestore, collection, doc, updateDoc} from '@angular/fire/firestore';
import { AuthService } from 'src/app/shared/services/auth.service';


@Injectable({
  providedIn: 'root'
})


@Component({
  selector: 'app-dialog-picture-edit',
  templateUrl: './dialog-picture-edit.component.html',
  styleUrls: ['./dialog-picture-edit.component.scss']
})
export class DialogPictureEditComponent {
  user!: User;
  loading = false;
  userId!: string;

  constructor(
    private firestore: Firestore,
    public dialogRef: MatDialogRef<DialogPictureEditComponent>,
    public authService: AuthService,
  ) {}

}
