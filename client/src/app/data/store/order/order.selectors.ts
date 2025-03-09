import { createSelector } from '@ngrx/store';
import { OrderFeature, OrderState } from './order.reducer';

export const selectPreOrder = createSelector(
  OrderFeature.selectOrderFeatureState,
  (state: OrderState) => {
    return state.products;
  }
);
