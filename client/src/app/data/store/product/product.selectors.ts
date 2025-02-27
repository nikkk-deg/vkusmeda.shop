import { createSelector } from '@ngrx/store';
import { ProductFeature, ProductState } from './product.reducer';

export const selectProducts = createSelector(
  ProductFeature.selectProductFeatureState,
  (state: ProductState) => {
    return state.products;
  }
);

export const selectProductsLoading = createSelector(
  ProductFeature.selectProductFeatureState,
  (state: ProductState) => {
    return state.isLoading;
  }
);

export const selectProductsError = createSelector(
  ProductFeature.selectProductFeatureState,
  (state: ProductState) => {
    return state.isError;
  }
);
