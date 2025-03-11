import {
  createAction,
  createActionGroup,
  emptyProps,
  props,
} from '@ngrx/store';
import { UserInterface } from '../../interfaces/user.interface';
import { BasketInterface } from '../../interfaces/basket.interface';
import { ProductInterface } from '../../interfaces/product.interface';
import { OrdersInterface } from '../../interfaces/orders.interface';

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    'Get User': props<{ token: string }>(),
    'Get User Success': props<{ user: UserInterface | null }>(),
    'Logout User': emptyProps(),
    'Load User': emptyProps(),
    'Error User': emptyProps(),
    'Load Email': emptyProps(),
    'Error Email': emptyProps(),
    'Complete Email': emptyProps(),
    'Complete User': emptyProps(),
    'Get Basket': props<{ userId: string }>(),
    'Get Basket Success': props<{ basket: BasketInterface }>(),
    'Add To  Basket': props<{
      item: { productId: ProductInterface; jars: number };
    }>(),
    'Get Orders': emptyProps(),
    'Set Orders': props<{ orders: OrdersInterface[] }>(),
    'Load Orders': emptyProps(),
    'Error Orders': emptyProps(),
    'Complete Orders': emptyProps(),
  },
});
