import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html'
})
export class SidenavComponent {

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  panelOpenState = false;

  sidebarToggle() {
    this.document.body.classList.toggle('toggle-sidebar');
  }
}
