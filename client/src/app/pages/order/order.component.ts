import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { selectProducts } from '../../data/store/product/product.selectors';
import { OrdersInterface } from '../../data/interfaces/orders.interface';
import { Store } from '@ngrx/store';
import { selectOrders } from '../../data/store/auth/auth.selectors';
import { OrderService } from '../../data/services/order.service';
import { authActions } from '../../data/store/auth/auth.actions';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-order',
  imports: [RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent {
  route = inject(ActivatedRoute);
  orderId = signal<string | null>(null);
  order = signal<OrdersInterface | null>(null);
  store = inject(Store);
  orders = this.store.selectSignal(selectOrders);
  orderService = inject(OrderService);
  totalCount = signal(0);
  totalPrice = signal(0);
  router = inject(Router);
  cookieService = inject(CookieService);
  titleService = inject(Title);

  constructor() {
    effect(() => {
      this.order.set(
        this.store
          .selectSignal(selectOrders)()!
          .filter((item) => item._id === this.orderId())[0]
      );
      if (!this.order()) {
        this.router.navigate(['/error']);
      }
    });

    effect(() => {
      this.totalCount.set(
        //@ts-ignore
        this.order()?.products.reduce((acc, item) => acc + item.jars, 0)
      );
    });

    effect(() => {
      this.totalPrice.set(
        //@ts-ignore
        this.order()?.products.reduce(
          (acc, item) => acc + item.productId.price * item.jars,
          0
        )
      );
    });
  }

  ngOnInit() {
    this.titleService.setTitle('Заказ');

    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.orderId.set(params.get('orderId'));
    });
  }

  cancelOrder() {
    this.orderService.cancelOrder(this.order()!._id);
    const token = this.cookieService.get('token');
    this.store.dispatch(authActions.getUser({ token }));
  }

  formateDate(dateString: string) {
    const date = new Date(dateString);
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear().toString().slice(2);
    return `${day}/${month}/${year}`;
  }

  formateTime(dateString: string) {
    const date = new Date(dateString);
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}
