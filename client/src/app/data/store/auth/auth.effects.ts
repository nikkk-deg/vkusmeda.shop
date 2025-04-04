import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { map, catchError, switchMap, EMPTY, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { authActions } from './auth.actions';
import { BasketService } from '../../services/basket.service';
import { Store } from '@ngrx/store';
import { LocalStorageService } from '../../services/local-storage.service';
import { OrderService } from '../../services/order.service';
import { selectUser } from './auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  authService = inject(AuthService);
  orderService = inject(OrderService);
  basketService = inject(BasketService);
  actions$ = inject(Actions);
  store = inject(Store);
  localStorageService = inject(LocalStorageService);
  user = this.store.selectSignal(selectUser);

  getUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.getUser),
      switchMap(({ token }) => {
        return this.authService.getUser(token);
      }),
      map((res) => {
        return authActions.getUserSuccess({
          user: res,
        });
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  });

  getBasket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.getUserSuccess),
      switchMap((res) => {
        if (res.user?._id) {
          const localBasket = this.localStorageService.getItem('basket');
          if (localBasket) {
            return this.basketService.syncBasket();
          } else {
            return this.basketService.getBasket(res.user?._id);
          }
        } else {
          return this.basketService.getBasket('');
        }
      }),

      map((res) => {
        return authActions.getBasketSuccess({
          //@ts-ignore
          basket: res,
        });
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  });

  getOrders$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(authActions.getUserSuccess),
      switchMap(() => {
        return this.orderService.getOrders();
      }),
      map((res) => {
        res.sort((a, b) => {
          //@ts-ignore
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        return authActions.setOrders({ orders: res });
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  });
}
