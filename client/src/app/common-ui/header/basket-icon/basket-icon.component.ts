import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectBasket } from '../../../data/store/auth/auth.selectors';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-basket-icon',
  imports: [RouterLink],
  templateUrl: './basket-icon.component.html',
  styleUrl: './basket-icon.component.scss',
})
export class BasketIconComponent {
  store = inject(Store);
  router = inject(Router);
  currentRoute = ``;
  cookieService = inject(CookieService);
  basket = this.store.selectSignal(selectBasket);
  basketCount = signal(0);

  constructor() {
    effect(() => {
      let sum = 0;
      this.basket()?.products.forEach((item) => {
        sum += item.jars;
      });
      this.basketCount.set(sum);
    });

    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }
}
