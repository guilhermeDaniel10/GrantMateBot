import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  showSideNav: boolean = true;
  showCloseButton: boolean = false;
  showMenuButton: boolean = false;

  ngOnInit() {
    this.decideNavConfigs();
  }

  showFiller = false;
  @ViewChild('drawer') snav: any;
  isExpanded: boolean = true;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  openSideNav() {
    this.snav.open();
    this.showCloseButton = true;
    this.showMenuButton = false;
  }

  closeSideNav() {
    this.snav.close();
    this.showCloseButton = false;
    this.showMenuButton = true;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.decideNavConfigs();
  }

  decideNavConfigs() {
    if (window.innerWidth <= 800) {
      this.showSideNav = false;
      this.showMenuButton = true;
    } else {
      this.showSideNav = true;
      this.showMenuButton = false;
    }
  }
}
