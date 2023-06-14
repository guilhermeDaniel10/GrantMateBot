import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FileUploadService } from '../file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Output() fileAsTxtEvent: EventEmitter<string[]> = new EventEmitter();

  // Variable to store shortLink from api response
  shortLink: string = '';
  loading: boolean = false; // Flag variable
  file: File | null = null; // Variable to store file

  // Inject service
  constructor(private fileUploadService: FileUploadService) {}

  ngOnInit(): void {}

  // On file Select
  onChange(event: any) {
    this.file = event.target.files[0];
  }

  // OnClick of button Upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService
      .uploadFileToTxt(this.file)
      .subscribe((event: any) => {
        //convert array of string to a single string

        this.fileAsTxtEvent.emit(event.information);
        if (typeof event === 'object') {
          // Short link via api response
          this.shortLink = event.link;

          this.loading = false; // Flag variable
        }
      });
  }

}
