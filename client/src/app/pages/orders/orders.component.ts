import { Component, effect, inject, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectOrders, selectUser } from '../../data/store/auth/auth.selectors';
import { Router, RouterLink } from '@angular/router';
import { authActions } from '../../data/store/auth/auth.actions';
import { OrdersInterface } from '../../data/interfaces/orders.interface';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../data/services/auth.service';

@Component({
  selector: 'app-orders',
  imports: [RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
  productsCount = signal(0);
  orders = signal<OrdersInterface[] | null>(null);
  titleService = inject(Title);
  authService = inject(AuthService);
  router = inject(Router);

  ngOnInit() {
    this.titleService.setTitle('Заказы');
  }

  constructor() {
    if (!this.user()?.email) {
      this.router.navigate(['auth']);
    }
    effect(() => {
      this.orders.set(this.store.selectSignal(selectOrders)());
    });
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

  getTotalJars(products: any[]) {
    return products.reduce((acc, product) => acc + product.jars, 0);
  }

  logout() {
    this.authService.logout();
  }
}
