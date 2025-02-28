import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import { BasketInterface } from '../interfaces/basket.interface';
import { catchError, EMPTY, of, take, tap } from 'rxjs';
import { authActions } from '../store/auth/auth.actions';
import { selectUser } from '../store/auth/auth.selectors';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  #http = inject(HttpClient);
  apiUrl = 'http://localhost:3000/api/basket/';
  cookieService = inject(CookieService);
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
  localStorageService = inject(LocalStorageService);

  getBasket(userId: string) {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.cookieService.get('token')}`,
      }),
    };

    if (!this.cookieService.get('token')) {
      return of(this.localStorageService.getItem<BasketInterface>('basket'));
    } else {
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

  addToBasket(productId: string, jars: number, product: any = null) {
    if (this.user()) {
      return;
    } else {
      const localBasket =
        this.localStorageService.getItem<BasketInterface>('basket');
      if (!localBasket) {
        this.localStorageService.setItem('basket', {
          products: [
            {
              productId: product,
              jars: 1,
            },
          ],
        });
      } else {
        const existingProduct = localBasket.products.filter((item) => {
          //@ts-ignore
          return item.productId._id === product._id;
        });

        if (existingProduct.length) {
          const index = localBasket.products.findIndex(
            //@ts-ignore

            (item) => item.productId._id === product._id
          );
          localBasket.products[index].jars += 1;
          this.localStorageService.setItem('basket', localBasket);
        } else {
          localBasket.products.push({
            //@ts-ignore

            productId: product,
            jars: 1,
          });
          this.localStorageService.setItem('basket', localBasket);
        }
      }
    }
  }
}
