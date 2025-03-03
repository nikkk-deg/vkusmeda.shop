import { createAction, createActionGroup, props } from '@ngrx/store';
import { UserInterface } from '../../interfaces/user.interface';
import { BasketInterface } from '../../interfaces/basket.interface';
import { ProductInterface } from '../../interfaces/product.interface';

export const authActions = createActionGroup({
  source: 'auth',
  events: {
    'Get User': props<{ token: string }>(),
    'Get User Success': props<{ user: UserInterface | null }>(),
    'Logout User': props<any>(),
    'Load User': props<any>(),
    'Error User': props<any>(),
    'Load Email': props<any>(),
    'Error Email': props<any>(),
    'Complete Email': props<any>(),
    'Complete User': props<any>(),
    'Get Basket': props<{ userId: string }>(),
    'Get Basket Success': props<{ basket: BasketInterface }>(),
    'Add To  Basket': props<{
      item: { productId: ProductInterface; jars: number };
    }>(),
  },
});
