import { Component, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectBasket, selectUser } from '../../data/store/auth/auth.selectors';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AddToBasketComponent } from '../../common-ui/add-to-basket/add-to-basket.component';
import {
  BasketInterface,
  ProductInterfaceForBasket,
} from '../../data/interfaces/basket.interface';
import { selectPreOrder } from '../../data/store/order/order.selectors';
import { ProductInterface } from '../../data/interfaces/product.interface';
import { ProductInterfaceForOrder } from '../../data/interfaces/order.interface';
import { ordersActions } from '../../data/store/order/order.actions';
import { BasketService } from '../../data/services/basket.service';
import { authActions } from '../../data/store/auth/auth.actions';

@Component({
  selector: 'app-basket',
  imports: [RouterLink, AddToBasketComponent],
  templateUrl: './basket.component.html',
  styleUrl: './basket.component.scss',
})
export class BasketComponent {
  store = inject(Store);
  basketService = inject(BasketService);
  basket = this.store.selectSignal(selectBasket);
  preOrder = this.store.selectSignal(selectPreOrder);
  totalPrice = signal(0);
  totalCount = signal(0);
  user = this.store.selectSignal(selectUser);

  constructor() {
    effect(() => {
      this.totalCount.set(
        this.preOrder().reduce((acc, item) => acc + item.jars, 0)
      );
    });

    effect(() => {
      this.totalPrice.set(
        this.preOrder().reduce(
          (acc, item) => acc + item.productId.price * item.jars,
          0
        )
      );
    });
  }

  isChecked(product: ProductInterfaceForBasket) {
    const isChecked = this.preOrder().findIndex(
      (item) => item.productId._id === product.productId._id
    );
    if (isChecked > -1) return true;
    return false;
  }

  checkProduct(product: ProductInterfaceForBasket) {
    this.store.dispatch(ordersActions.setPreOrder({ product: product }));
  }

  deleteChecked() {
    this.basketService.deleteManyFromBasket(this.preOrder());
    this.store.dispatch(authActions.getUserSuccess({ user: this.user() }));
    this.store.dispatch(ordersActions.clearPreOrder());
  }
}
