import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CookieService } from 'ngx-cookie-service';
import {
  BasketInterface,
  ProductInterfaceForBasket,
} from '../interfaces/basket.interface';
import { catchError, delay, EMPTY, of, take, tap } from 'rxjs';
import { authActions } from '../store/auth/auth.actions';
import { selectBasket, selectUser } from '../store/auth/auth.selectors';
import { LocalStorageService } from './local-storage.service';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  #http = inject(HttpClient);
  apiUrl = `${environment.apiUrl}basket/`;
  cookieService = inject(CookieService);
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
  localStorageService = inject(LocalStorageService);
  basket = this.store.selectSignal(selectBasket);

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

  deleteManyFromBasket(products: ProductInterfaceForBasket[]) {
    if (this.user()) {
      const headers = {
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.cookieService.get('token')}`,
        }),
      };

      products.forEach((item) => {
        this.#http
          .post(
            `${environment.apiUrl}basket/remove`,
            { userId: this.user()?._id, productId: item.productId._id },
            headers
          )
          .pipe(take(1))
          .subscribe();
      });
    }
    const localBasket =
      this.localStorageService.getItem<BasketInterface>('basket');

    products.forEach((item) => {
      //@ts-ignore
      const index = localBasket?.products.findIndex((j) => {
        return j.productId._id === item.productId._id;
      });

      //@ts-ignore
      if (index > -1) {
        //@ts-ignore
        localBasket?.products.splice(index, 1);
      }
    });
    this.localStorageService.setItem('basket', localBasket);
  }

  changeToBasket(product: any = null, count: number) {
    const localBasket =
      this.localStorageService.getItem<BasketInterface>('basket');
    if (!localBasket) {
      this.localStorageService.setItem('basket', {
        products: [
          {
            productId: product,
            jars: count,
          },
        ],
      });
      return EMPTY;
    } else {
      const existingProduct = localBasket.products.filter(
        //@ts-ignore
        (item) => {
          //@ts-ignore
          return item.productId._id === product._id;
        }
      );

      if (existingProduct.length) {
        const index = localBasket.products.findIndex(
          //@ts-ignore

          (item) => item.productId._id === product._id
        );
        localBasket.products[index].jars += count;
        if (localBasket.products[index].jars === 0) {
          localBasket.products.splice(index, 1);
        }
        this.localStorageService.setItem('basket', localBasket);
      } else {
        localBasket.products.push({
          //@ts-ignore

          productId: product,
          jars: 1,
        });
        this.localStorageService.setItem('basket', localBasket);
      }

      // }
      return EMPTY;
    }
  }

  syncBasket() {
    const headers = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.cookieService.get('token')}`,
      }),
    };

    const localBasket = this.localStorageService.getItem('basket');

    if (localBasket) {
      const basketArrayOfId: {
        productId: string;
        jars: number;
      }[] = [];
      //@ts-ignore
      localBasket.products.forEach((item) => {
        basketArrayOfId.push({
          productId: item.productId._id,
          jars: item.jars,
        });
      });
      this.localStorageService.clear();

      const body = {
        userId: this.user()?._id,
        products: basketArrayOfId,
      };
      return this.#http
        .post(`${this.apiUrl}syncBasket`, body, headers)
        .pipe(take(1));
    }
    return EMPTY;
  }
}
