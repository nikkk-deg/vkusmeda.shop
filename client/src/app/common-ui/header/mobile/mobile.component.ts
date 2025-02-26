import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile',
  imports: [],
  templateUrl: './mobile.component.html',
  styleUrl: './mobile.component.scss',
})
export class MobileComponent {
  router = inject(Router);
  navigateTo(link: string) {
    this.router.navigate([link]);
  }
}
