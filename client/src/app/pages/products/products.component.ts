import { Store } from '@ngrx/store';
import { ProductInterface } from './../../data/interfaces/product.interface';
import { Component, effect, inject, signal } from '@angular/core';
import { selectProducts } from '../../data/store/product/product.selectors';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [JsonPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  store = inject(Store);
  products = signal<ProductInterface[] | []>([]);
  productsFromStore = this.store.selectSignal(selectProducts);

  constructor() {
    effect(() => {
      this.products.set(this.productsFromStore());
    });
  }
}
