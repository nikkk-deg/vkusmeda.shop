import { Component, effect, inject, Renderer2, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs';
import { FiltersService } from '../../../../data/services/filters.service';
import {
  selectFilters,
  selectProducts,
} from '../../../../data/store/product/product.selectors';

@Component({
  selector: 'app-filters-mobile',
  imports: [ReactiveFormsModule],
  templateUrl: './filters-mobile.component.html',
  styleUrl: './filters-mobile.component.scss',
})
export class FiltersMobileComponent {
  store = inject(Store);
  filters = this.store.selectSignal(selectFilters);
  categories = signal<string[]>([]);
  products = this.store.selectSignal(selectProducts);
  filtersService = inject(FiltersService);
  sortControl = new FormControl('');
  isVisible = signal(false);

  constructor() {
    const newCategories: string[] = [];
    effect(() => {
      this.products().forEach((item) => {
        newCategories.push(item.titleRu);
      });
      this.categories.set(newCategories);
    });

    effect(() => {
      this.sortControl.setValue(this.filters().sortBy, { emitEvent: false });

      this.sortControl.valueChanges.subscribe((newSort) => {
        //@ts-ignore
        this.filtersService.changeSelectAndDispatch(newSort);
      });
    });
  }

  setIsVisible() {
    this.isVisible.set(!this.isVisible());
  }

  changeCategory(category: string) {
    this.filtersService.changeCategoryAndDispatch(category);
  }

  isChecked(item: string) {
    return this.filters().selected.includes(item);
  }

  clearFilters() {
    this.filtersService.resetFilters();
  }
}
