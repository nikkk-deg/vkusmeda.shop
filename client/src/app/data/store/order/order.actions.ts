import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProductInterfaceForBasket } from '../../interfaces/basket.interface';

export const ordersActions = createActionGroup({
  source: 'product',
  events: {
    'Get Pre Order': emptyProps(),
    'Set Pre Order': props<{ product: ProductInterfaceForBasket }>(),
    'Update Pre Order': props<{
      product: ProductInterfaceForBasket;
      count: number;
    }>(),
    'Clear Pre Order': emptyProps(),
    'Set Pre Order To SS ': props<{ products: ProductInterfaceForBasket[] }>(),
  },
});
