import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { productsActions } from './product.actions';
import { catchError, EMPTY, map, switchMap } from 'rxjs';
import { ProductsService } from '../../services/products.service';

@Injectable({
  providedIn: 'root',
})
export class ProductEffects {
  actions$ = inject(Actions);
  store = inject(Store);
  productService = inject(ProductsService);

  getProducts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(productsActions.getProducts),
      switchMap(() => {
        return this.productService.getProducts();
      }),
      map((res) => {
        return productsActions.getProductsSuccess({
          products: res,
        });
      }),
      catchError((err) => {
        console.error(err);
        return EMPTY;
      })
    );
  });
}
