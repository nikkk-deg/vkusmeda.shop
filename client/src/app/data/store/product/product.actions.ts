import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ProductInterface } from '../../interfaces/product.interface';

export const productsActions = createActionGroup({
  source: 'product',
  events: {
    'Get Products': emptyProps(),
    'Get Products Success': props<{ products: ProductInterface[] }>(),
    'Load Products': emptyProps(),
    'Error Products': emptyProps(),
    'Complete Products': emptyProps(),
    'Set Filters': props<{
      filters: {
        sortBy: string;
        selected: string[] | [];
      };
    }>(),
    'Reset Filters': emptyProps(),
  },
});
