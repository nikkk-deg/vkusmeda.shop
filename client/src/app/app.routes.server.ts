import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { ProductsService } from './data/services/products.service';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'product/:productId',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const productService = inject(ProductsService);
      let ids: string[] = [];
      await productService.getIdsForPrerender().subscribe((res) => {
        res.forEach((item) => ids.push(item._id));
      });

      return ids.map((id) => ({ id }));
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
