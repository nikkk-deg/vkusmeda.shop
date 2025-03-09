import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { productsActions } from '../store/product/product.actions';
import { ordersActions } from '../store/order/order.actions';
import { ProductInterfaceForBasket } from '../interfaces/basket.interface';

@Injectable({
  providedIn: 'root',
})
export class PreOrderService {
  store = inject(Store);
  getPreOrderFromSSAndDispatch() {
    const preOrder = sessionStorage.getItem('preOrder');
    if (!preOrder) {
      const newPreOrder = {
        products: [],
      };

      sessionStorage.setItem('preOrder', JSON.stringify(newPreOrder.products));
      this.store.dispatch(
        ordersActions.setPreOrderToSS({ products: newPreOrder.products })
      );
      return;
    }
    const preOrderForStore = JSON.parse(preOrder);

    this.store.dispatch(
      ordersActions.setPreOrderToSS({ products: preOrderForStore })
    );

    return;
  }
}
