import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { ProductsService } from './data/services/products.service';
import { firstValueFrom } from 'rxjs';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product/:productId',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const productService = inject(ProductsService);
      const res = await firstValueFrom(productService.getIdsForPrerender());
      return res.map((item) => ({ productId: item._id })); // исправил ключ `id` → `productId`
    },
  },
  {
    path: 'order/:orderId',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
