import { Component, OnInit, Input } from '@angular/core';
import { FileUpload } from './../../../models/file-upload.class';
import { UploadService } from 'src/app/shared/services/upload.service';
import { User } from 'src/models/user.class';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth } from '@angular/fire/auth';


@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})
export class UploadDetailsComponent implements OnInit {
  @Input() fileUpload!: FileUpload;
  private basePath = '/uploads';

  constructor(
    public uploadFile: UploadService,
    public userService: UserService,
    public auth: AngularFireAuth
  ) { }

  ngOnInit(): void {
  }


  deleteFile(): void {
    const auth = getAuth();
    let userId = auth.currentUser?.uid!;
    this.uploadFile.deleteFile(userId);
  }
}
