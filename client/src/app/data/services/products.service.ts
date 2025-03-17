import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { take, tap, catchError, EMPTY, map } from 'rxjs';
import { ProductInterface } from '../interfaces/product.interface';
import { productsActions } from '../store/product/product.actions';
import { environment } from '../../../enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  #http = inject(HttpClient);
  apiUrl = `${environment.apiUrl}product`;

  store = inject(Store);

  getProducts() {
    this.store.dispatch(productsActions.loadProducts());
    return this.#http.get<ProductInterface[]>(`${this.apiUrl}`).pipe(
      take(1),
      tap(() => {
        this.store.dispatch(productsActions.completeProducts());
      }),
      catchError((error) => {
        this.store.dispatch(productsActions.errorProducts());
        setTimeout(() => {
          this.store.dispatch(productsActions.completeProducts());
        }, 1000);
        console.error(`Error in get products request - \n ${error}`);
        return EMPTY;
      })
    );
  }

  getIdsForPrerender() {
    return this.#http
      .get<ProductInterface[]>(`http://backend:3000/api/product`)
      .pipe(take(1));
  }

  getProductById(id: string | null) {
    return this.#http
      .get<ProductInterface>(`http://backend:3000/api/product/${id}`)
      .pipe(take(1));
  }
}
