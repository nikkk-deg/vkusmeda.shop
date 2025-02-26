import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService } from '../../../data/services/auth.service';
import { selectUser } from '../../../data/store/auth/auth.selectors';

@Component({
  selector: 'app-auth-icon',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './auth-icon.component.html',
  styleUrl: './auth-icon.component.scss',
})
export class AuthIconComponent {
  store = inject(Store);
  router = inject(Router);
  user = this.store.selectSignal(selectUser);
  currentRoute = ``;
  authService = inject(AuthService);

  @Input() isLogout!: boolean;

  logout() {
    this.authService.logout();
  }

  constructor() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
}
