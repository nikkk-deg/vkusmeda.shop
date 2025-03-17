import {
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  Input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasketService } from '../../data/services/basket.service';
import { authActions } from '../../data/store/auth/auth.actions';
import { selectBasket, selectUser } from '../../data/store/auth/auth.selectors';
import { ordersActions } from '../../data/store/order/order.actions';

@Component({
  selector: 'app-add-to-basket',
  imports: [],
  templateUrl: './add-to-basket.component.html',
  styleUrl: './add-to-basket.component.scss',
})
export class AddToBasketComponent {
  router = inject(Router);
  basketService = inject(BasketService);
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
  basket = this.store.selectSignal(selectBasket);
  isInBasket = signal(false);
  productCount = signal(0);
  cdr = inject(ChangeDetectorRef);

  //@ts-ignore
  @Input() product;

  @Input() isBig?: boolean;

  constructor() {
    effect(() => {
      const index = this.basket()?.products.findIndex(
        (item) => item.productId._id === this.product._id
      );
      //@ts-ignore

      if (index > -1 && this.basket()?.products[index].jars > 0) {
        //@ts-ignore

        this.productCount.set(this.basket()?.products[index].jars);
        this.isInBasket.set(true);
      } else {
        this.isInBasket.set(false);
      }
    });
  }

  addToBasket(count: number) {
    this.basketService.changeToBasket(this.product, count);
    this.store.dispatch(
      ordersActions.updatePreOrder({ product: this.product, count })
    );
    this.store.dispatch(authActions.getUserSuccess({ user: this.user() }));
  }

  addToBasketForFirstTime() {
    this.store.dispatch(
      ordersActions.setPreOrder({
        product: { productId: this.product, jars: 1 },
      })
    );
  }
}
