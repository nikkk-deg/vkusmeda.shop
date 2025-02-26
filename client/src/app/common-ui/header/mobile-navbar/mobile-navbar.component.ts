import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../data/services/auth.service';
import { selectUser } from '../../../data/store/auth/auth.selectors';
import { CommonModule } from '@angular/common';
import { AuthIconComponent } from '../auth-icon/auth-icon.component';
import { BasketIconComponent } from '../basket-icon/basket-icon.component';

@Component({
  selector: 'app-mobile-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    AuthIconComponent,
    BasketIconComponent,
    CommonModule,
  ],
  templateUrl: './mobile-navbar.component.html',
  styleUrl: './mobile-navbar.component.scss',
})
export class MobileNavbarComponent {
  store = inject(Store);
  router = inject(Router);
  user = this.store.selectSignal(selectUser);
  currentRoute = ``;
  authService = inject(AuthService);
  isLogout = false;
  isOpen = signal(false);

  setIsLogout(action: boolean) {
    if (action) {
      this.isLogout = !this.isLogout;
    } else {
      this.isLogout = false;
    }
  }

  setOpen(action: boolean) {
    if (action) {
      this.isOpen.set(!this.isOpen());
    } else {
      this.isOpen.set(false);
    }
  }

  logout() {
    this.authService.logout();
  }

  constructor() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
}
