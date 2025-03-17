import { inject, Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductsService } from './products.service';

@Injectable({ providedIn: 'root' })
export class ProductResolver implements Resolve<any> {
  productService = inject(ProductsService);

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const productId = route.paramMap.get('productId');
    return this.productService.getProductById(productId!);
  }
}
