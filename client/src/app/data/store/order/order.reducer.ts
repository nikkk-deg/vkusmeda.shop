import { createFeature, createReducer, on } from '@ngrx/store';
import { ProductInterfaceForOrder } from '../../interfaces/order.interface';
import { ordersActions } from './order.actions';
import { ProductInterfaceForBasket } from '../../interfaces/basket.interface';

export interface OrderState {
  products: ProductInterfaceForBasket[];
}

export const initialStateOrder: OrderState = {
  products: [],
};

export const OrderFeature = createFeature({
  name: 'orderFeature',
  reducer: createReducer(
    initialStateOrder,
    on(ordersActions.setPreOrder, (state, payload) => {
      const products = [...state.products];
      const index = products.findIndex(
        (item) => item.productId._id === payload.product.productId._id
      );

      if (index > -1) {
        products.splice(index, 1);
      } else {
        products.push(payload.product);
      }
      sessionStorage.setItem('preOrder', JSON.stringify(products));
      return { ...state, products: products };
    }),
    on(ordersActions.updatePreOrder, (state, payload) => {
      const products = [...state.products];
      const index = products.findIndex(
        //@ts-ignore
        (item) => item.productId._id === payload.product._id
      );

      if (index > -1) {
        if (products[index].jars + payload.count > 0) {
          products.push({
            //@ts-ignore

            productId: payload.product,
            jars: products[index].jars + payload.count,
          });
        }

        products.splice(index, 1);
      }
      sessionStorage.setItem('preOrder', JSON.stringify(products));

      return { ...state, products: products };
    }),
    on(ordersActions.clearPreOrder, (state) => {
      return { ...state, products: [] };
    }),
    on(ordersActions.setPreOrderToSS, (state, payload) => {
      return { ...state, products: payload.products };
    })
  ),
});
