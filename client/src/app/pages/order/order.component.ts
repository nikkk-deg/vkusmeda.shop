import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { selectProducts } from '../../data/store/product/product.selectors';
import { OrdersInterface } from '../../data/interfaces/orders.interface';
import { Store } from '@ngrx/store';
import { selectOrders } from '../../data/store/auth/auth.selectors';

@Component({
  selector: 'app-order',
  imports: [],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  route = inject(ActivatedRoute);
  orderId = signal<string | null>(null);
  order = signal<OrdersInterface | null>(null);
  store = inject(Store);

  constructor() {
    effect(() => {
      this.order.set(
        //@ts-ignore
        this.store
          .selectSignal(selectOrders)()
          .filter((item) => item._id === this.orderId())[0]
      );
    });
  }

  ngOnInit() {
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.orderId.set(params.get('orderId'));
    });
  }
}
