import { Component, OnInit } from '@angular/core';
import { FileUpload } from './../../../models/file-upload.class';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  currentFileUpload?: FileUpload;
  percentage = 0;
  file!: File;

  constructor(public uploadFile: UploadService) { }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    this.file = event.target.files[0];
  }
}
