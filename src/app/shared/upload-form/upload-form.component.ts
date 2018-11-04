import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { UploadService } from '../upload.service';
import { Upload } from '../upload';
import * as _ from "lodash";

@Component({
  selector: 'upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {

  selectedFiles: FileList;
  currentUpload: Upload;
  @Input() parentKey: string;
  @Output() fileUploadData = new EventEmitter<any>();

  constructor(private upSvc: UploadService) { }

  ngOnInit() {
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0);
    this.currentUpload = new Upload(file);
    this.fileUploadData.emit(this.currentUpload);
    this.upSvc.pushUpload(this.parentKey, this.currentUpload);
  }

  uploadMulti() {
    let files = this.selectedFiles
    if (_.isEmpty(files)) return;

    let filesIndex = _.range(files.length)
    _.each(filesIndex, (idx) => {
      this.currentUpload = new Upload(files[idx]);
      this.upSvc.pushUpload(this.parentKey, this.currentUpload);
    }
    )
  }
}