import { Component, OnInit, Input } from '@angular/core';
import { FileUpload } from './../../../models/file-upload.class';
import { UploadService } from 'src/app/shared/services/upload.service';


@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})
export class UploadDetailsComponent implements OnInit {
  @Input() fileUpload!: FileUpload;
  private basePath = '/uploads';

  constructor(public uploadFile: UploadService) { }

  ngOnInit(): void {
  }


  deleteFile(fileUpload: FileUpload): void {
    this.uploadFile.deleteFile();
  }
}
