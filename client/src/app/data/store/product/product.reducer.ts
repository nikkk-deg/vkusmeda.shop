import { createFeature, createReducer, on } from '@ngrx/store';
import { ProductInterface } from '../../interfaces/product.interface';
import { productsActions } from './product.actions';

export interface ProductState {
  products: ProductInterface[] | [];
  isLoading: boolean;
  isError: boolean;
}

export const initialStateProducts: ProductState = {
  products: [],
  isLoading: false,
  isError: false,
};

export const ProductFeature = createFeature({
  name: 'productFeature',
  reducer: createReducer(
    initialStateProducts,
    on(productsActions.getProducts, (state) => ({ ...state })),
    on(productsActions.getProductsSuccess, (state, payload) => {
      return { ...state, products: payload.products };
    }),
    on(productsActions.loadProducts, (state) => ({
      ...state,
      isLoading: true,
    })),
    on(productsActions.errorProducts, (state) => ({ ...state, isError: true })),
    on(productsActions.completeProducts, (state) => ({
      ...state,
      isError: false,
      isLoading: false,
    }))
  ),
});
