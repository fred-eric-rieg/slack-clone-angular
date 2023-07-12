import { Injectable } from '@angular/core';
import { getStorage, deleteObject, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { UserService } from './user.service';
import { User } from 'src/models/user.class';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  storage = getStorage();

  constructor(private userService: UserService) { }


  uploadFile(file: File) {
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(this.storage, 'uploads/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on('state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;
          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          this.userService.getCurrentUser().then((userId: any) => {

            this.userService.users.subscribe((users: any) => {

              users.forEach((user: any) => {
                if (user.userId === userId) {
                  user.profilePicture = downloadURL;
                  this.userService.update(user);
                }
              });
            });
          });
        });
      }
    );
  }


  async deleteFile(userId: string) {
    // Get the current logged in client-user
    let user = await this.userService.getUserNotObservable(userId)
      .then(response => {
        return response.data() as User
      });

    // Create a reference to the file to delete
    let path = 'uploads/' + user.profilePicture.split('?')[0].split('%2F')[1];
    const desertRef = ref(this.storage, path);

    // Delete the file
    deleteObject(desertRef).then(() => {
      // File deleted successfully
      // Update user profile picture reference
      user.profilePicture = '';
      this.userService.update(user);
      console.log("Profile picture successfully deleted from: ", user);
    }).catch((error) => {
      console.log(error);
    });
  }
}
