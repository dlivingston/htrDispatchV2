import { Injectable } from '@angular/core';
import { Upload } from './upload';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
import * as firebase from 'firebase';
import { Subject, Observable, Subscription } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

@Injectable()
export class UploadService {

  constructor(private db: AngularFireDatabase, private afStorage: AngularFireStorage) { }

  private basePath: string = '/uploads';
  uploads: AngularFireList<Upload[]>;
  note: AngularFireObject<any>;
  uploadProgress: Subscription;
  downloadURL: Observable<any>;

  getUploads(query = {}) {
    this.uploads = this.db.list(this.basePath);
    return this.uploads
  }


  deleteUpload(upload: Upload) {
    this.deleteFileData(upload.$key)
      .then(() => {
        this.deleteFileStorage(upload.name)
      })
      .catch(error => console.log(error))
  }

  // Executes the file uploading to firebase https://firebase.google.com/docs/storage/web/upload-files
  pushUpload(subfolder: string, upload: Upload) {
    const storageRef = this.afStorage.ref(`${this.basePath}/${subfolder}/${upload.file.name}`);
    const uploadTask = storageRef.put(upload.file);
    this.uploadProgress = uploadTask.percentageChanges().subscribe(n => {
      upload.progress = n 
      if (upload.progress === 100) {
        upload.name = upload.file.name;
        upload.attachedKey = subfolder;
        if (subfolder.substring(0, 3) === 'HTR') {
          upload.attachedTo = 'ticket';
        } else {
          upload.attachedTo = 'note';
        }
        this.downloadURL = storageRef.getDownloadURL();
        this.downloadURL.subscribe(url => {
          upload.url = url;
          this.saveFileData(upload);
        });
        
      }
    });
    
  }

  // Writes the file details to the realtime db
  private saveFileData(upload: Upload) {
    this.db.list(`${this.basePath}/`).push(upload);
  }

  // Writes the file details to the realtime db
  private deleteFileData(key: string) {
    return this.db.list(`${this.basePath}/`).remove(key);
  }

  // Firebase files must have unique names in their respective storage dir
  // So the name serves as a unique key
  private deleteFileStorage(name: string) {
    const storageRef = firebase.storage().ref();
    storageRef.child(`${this.basePath}/${name}`).delete()
  }
}