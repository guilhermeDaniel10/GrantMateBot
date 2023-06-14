import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ExtractionResult } from '../core/models/extraction-result.model';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Returns an observable
  uploadFileToTxt(file: any): Observable<ExtractionResult> {
    // Create form data
    const formData = new FormData();

    // Store form name as "file" with file data
    formData.append('file', file, file.name);
    formData.append('description', file.name);
    formData.append('accessLevel', 'PRIVATE');

    // Make http post request over api
    // with formData as req
    return this.http
      .post<ExtractionResult>(`${this.apiUrl}/file/simple-extraction`, formData)
      .pipe(catchError(this.error));
  }

  // Handle Errors
  error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
