import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { UserInterface } from '../interfaces/user.interface';
import { selectUser } from '../store/auth/auth.selectors';
import { authActions } from '../store/auth/auth.actions';
import { OrdersInterface } from '../interfaces/orders.interface';
import { catchError, EMPTY, take, tap } from 'rxjs';
import { selectPreOrder } from '../store/order/order.selectors';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  #http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/api/orders/';
  router = inject(Router);
  products = signal<UserInterface | null>(null);
  cookieService = inject(CookieService);
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
  preOrder = this.store.selectSignal(selectPreOrder);

  getOrders() {
    if (this.user()) {
      this.store.dispatch(authActions.loadOrders());
      const headers = {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.cookieService.get('token')}`,
        }),
      };

      const body = {
        email: this.user()?.email,
      };
      return this.#http
        .post<OrdersInterface[]>(`${this.apiUrl}getOrders`, body, headers)
        .pipe(
          take(1),
          tap((res) => {
            this.store.dispatch(authActions.completeOrders());
          }),
          catchError((error) => {
            this.store.dispatch(authActions.errorOrders());
            setTimeout(() => {
              this.store.dispatch(authActions.completeOrders());
            }, 1000);
            console.error(`Error in get orders request - \n ${error}`);
            return EMPTY;
          })
        );
    }
    return EMPTY;
  }

  cancelOrder(id: string) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.cookieService.get('token')}`,
      }),
    };

    return this.#http
      .get(`${this.apiUrl}cancelOrder/${id}`, headers)
      .pipe(take(1))
      .subscribe();
  }

  makeOrder(email: string) {
    const newArray: any[] = [];
    this.preOrder().forEach((item) => {
      const object = {
        productId: item.productId._id,
        jars: item.jars,
      };
      newArray.push(object);
    });

    const body = {
      email: email,
      products: newArray,
    };

    this.#http.post(`${this.apiUrl}create`, body).pipe(take(1)).subscribe();
  }

  saveUser(userData: {
    name: string | null;
    surname: string | null;
    email: string | null;
    phoneNumber: string | null;
  }) {
    this.#http
      .post(`${this.apiUrl}rememberUser`, userData)
      .pipe(take(1))
      .subscribe();
  }
}
