import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { UserInterface } from '../interfaces/user.interface';
import { BasketInterface } from '../interfaces/basket.interface';
import { catchError, EMPTY, take, tap } from 'rxjs';
import { authActions } from '../store/auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  #http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/api/basket/';
  cookieService = inject(CookieService);
  store = inject(Store);

  getBasket(userId: string) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.cookieService.get('token')}`,
      }),
    };
    this.store.dispatch(authActions.loadUser());
    return this.#http
      .get<BasketInterface>(`${this.apiUrl}${userId}`, headers)
      .pipe(
        take(1),
        tap(() => {
          this.store.dispatch(authActions.completeUser());
        }),
        catchError((error) => {
          this.store.dispatch(authActions.errorUser());
          setTimeout(() => {
            this.store.dispatch(authActions.completeUser());
          }, 1000);
          console.error(`Error in get basket request - \n ${error}`);
          return EMPTY;
        })
      );
  }
}
