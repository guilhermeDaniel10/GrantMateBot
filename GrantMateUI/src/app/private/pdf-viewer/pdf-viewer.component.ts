import { Component, HostListener } from '@angular/core';
import { TextSelectEvent } from '../project-upload/text-selection/text-select-event.directive';

interface SelectionRectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent {
  src = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';
  highlitedText: string = '';
  public hostRectangle: SelectionRectangle | null;
  public selectedText: string;

  onMouseUp(event: any) {
    const evenTarget = event.target as HTMLElement;
    console.log(evenTarget);
  }

  onMouseDown(event: any) {
    const evenTarget = event.target as HTMLElement;
    console.log(evenTarget);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    console.log(event);
  }

  public renderRectangles(event: TextSelectEvent): void {
    console.group('Text Select Event');
    console.log(event);
    console.log('Text:', event.text);
    this.highlitedText = event.text;
    console.log('Viewport Rectangle:', event.viewportRectangle);
    console.log('Host Rectangle:', event.hostRectangle);
    console.groupEnd();

    // If a new selection has been created, the viewport and host rectangles will
    // exist. Or, if a selection is being removed, the rectangles will be null.
    if (event.hostRectangle) {
      this.hostRectangle = event.hostRectangle;
      this.selectedText = event.text;
    } else {
      this.hostRectangle = null;
      this.selectedText = '';
    }
  }
}
