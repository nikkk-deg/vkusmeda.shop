import { Store } from '@ngrx/store';
import { ProductInterface } from './../../data/interfaces/product.interface';
import { Component, effect, inject, signal } from '@angular/core';
import {
  selectFilters,
  selectProducts,
} from '../../data/store/product/product.selectors';
import { ProductCardComponent } from './product-card/product-card.component';
import { FiltersComponent } from './filters/filters.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-products',
  imports: [ProductCardComponent, FiltersComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  store = inject(Store);
  filteredProducts = signal<ProductInterface[] | []>([]);
  productsFromStore = this.store.selectSignal(selectProducts);
  filters = this.store.selectSignal(selectFilters);

  constructor() {
    effect(() => {
      this.filteredProducts.set(this.setProductsWithFilters());
    });
  }

  setProductsWithFilters() {
    const filtered: ProductInterface[] = [];
    this.productsFromStore().forEach((item) => {
      if (this.filters().selected.length === 0) {
        filtered.push(item);
      } else {
        const index = this.filters().selected.findIndex(
          (j) => j === item.titleRu
        );
        if (index > -1) filtered.push(item);
      }
    });
    switch (this.filters().sortBy) {
      case 'popular': {
        filtered.sort((a, b) => b._id.localeCompare(a._id));
        break;
      }
      case 'price-up': {
        filtered.sort((a, b) => b.price - a.price);
        break;
      }
      case 'price-down': {
        filtered.sort((a, b) => a.price - b.price);
        break;
      }
      default: {
        return filtered;
      }
    }
    return filtered;
  }
}
