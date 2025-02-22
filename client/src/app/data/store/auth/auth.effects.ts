import { inject, Injectable } from '@angular/core';
import { createEffect, ofType, Actions } from '@ngrx/effects';
import { map, catchError, switchMap, EMPTY } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { authActions } from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthEffects {
  authService = inject(AuthService);
  actions$ = inject(Actions);

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
}
