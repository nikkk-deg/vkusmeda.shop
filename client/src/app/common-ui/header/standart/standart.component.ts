import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../data/services/auth.service';
import { Store } from '@ngrx/store';
import { selectAuth } from '../../../data/store/auth/auth.selectors';
import {
  Router,
  RouterEvent,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-standart',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './standart.component.html',
  styleUrl: './standart.component.scss',
})
export class StandartComponent {
  store = inject(Store);
  router = inject(Router);
  user = this.store.selectSignal(selectAuth);
  currentRoute = ``;

  constructor() {
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
}
