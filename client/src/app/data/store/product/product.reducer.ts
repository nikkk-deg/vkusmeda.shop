import { createFeature, createReducer, on } from '@ngrx/store';
import { ProductInterface } from '../../interfaces/product.interface';
import { productsActions } from './product.actions';

export interface ProductState {
  products: ProductInterface[] | [];
  isLoading: boolean;
  isError: boolean;
  filters: {
    sortBy: string;
    selected: string[];
  };
}

export const initialStateProducts: ProductState = {
  products: [],
  isLoading: false,
  isError: false,
  filters: {
    sortBy: 'popular',
    selected: [],
  },
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
    })),
    on(productsActions.setFilters, (state, payload) => ({
      ...state,
      filters: payload.filters,
    }))
  ),
});
