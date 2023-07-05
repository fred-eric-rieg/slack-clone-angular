import { Component, OnInit } from '@angular/core';
import { FileUploadService } from './../../shared/services/file-upload.service';
import { FileUpload } from './../../../models/file-upload.class';
import { UploadService } from 'src/app/shared/services/upload.service';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  file!: File;

  constructor(private uploadService: FileUploadService, public uploadFile: UploadService) { }

  ngOnInit(): void {
  }

  selectFile(event: any): void {
    //this.selectedFiles = event.target.files;
    this.file = event.target.files[0];
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
          percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }
}
