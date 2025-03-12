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

  getOrders() {
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
}
