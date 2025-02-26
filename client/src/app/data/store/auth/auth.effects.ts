import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import {
  map,
  catchError,
  switchMap,
  EMPTY,
  throwError,
  retry,
  delay,
  filter,
} from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { authActions } from './auth.actions';
import { BasketService } from '../../services/basket.service';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  authService = inject(AuthService);
  basketService = inject(BasketService);
  actions$ = inject(Actions);
  store = inject(Store);

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
        //@ts-ignore
        return this.basketService.getBasket(res.user?._id);
      }),
      map((res) => {
        return authActions.getBasketSuccess({
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
