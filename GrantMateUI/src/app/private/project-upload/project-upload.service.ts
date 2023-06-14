import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { environment } from 'src/app/environment';
import { DocumentSection } from 'src/app/core/models/document-section.model';
import { OrganizedSection } from 'src/app/core/models/organized-section.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectUploadService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createDocumentSectionLine(
    documentSectionLine: DocumentSection
  ): Observable<DocumentSection> {
    return this.http
      .post<DocumentSection>(
        `${this.apiUrl}/file/structured/line`,
        documentSectionLine
      )
      .pipe(catchError(this.error));
  }

  uploadHierarchySections(organizedSections: OrganizedSection) {
    return this.http
      .post<OrganizedSection>(
        `${this.apiUrl}/file/hierarchy`,
        organizedSections.h1Sections
      )
      .pipe(catchError(this.error));
  }

  getSavedSections(): Observable<DocumentSection[]> {
    return this.http
      .get<DocumentSection[]>(`${this.apiUrl}/file/structured`)
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
