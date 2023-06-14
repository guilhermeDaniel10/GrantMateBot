import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements AfterViewInit, AfterViewChecked {
  @ViewChild('chatBotContainer', { static: false })
  chatBotContainer: ElementRef;

  showSideNav = false;
  showSideNavButton = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth <= 800) {
      this.showSideNavButton = true;
    } else {
      this.showSideNavButton = false;
    }
    this.showSideNav = window.innerWidth > 800;
  }

  toggleSideNav() {
    this.showSideNav = !this.showSideNav;
  }

  ngAfterViewChecked(): void {
    this.scrollTBottom();
  }

  ngAfterViewInit(): void {
    this.scrollTBottom();
  }

  scrollTBottom() {
    try {
      this.chatBotContainer.nativeElement.scrollTop =
        this.chatBotContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
