import { Component, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPreOrder } from '../../data/store/order/order.selectors';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order',
  imports: [FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  store = inject(Store);
  order = this.store.selectSignal(selectPreOrder);
  totalPrice = signal(0);
  username = '';

  constructor() {
    console.log(this.username);
    effect(() => {
      this.totalPrice.set(
        this.order().reduce(
          (acc, item) => acc + item.jars * item.productId.price,
          0
        )
      );
    });
  }
}
