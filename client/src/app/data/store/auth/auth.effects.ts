import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { map, catchError, switchMap, EMPTY, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { authActions } from './auth.actions';
import { BasketService } from '../../services/basket.service';
import { Store } from '@ngrx/store';
import { LocalStorageService } from '../../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  authService = inject(AuthService);
  basketService = inject(BasketService);
  actions$ = inject(Actions);
  store = inject(Store);
  localStorageService = inject(LocalStorageService);

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
}
