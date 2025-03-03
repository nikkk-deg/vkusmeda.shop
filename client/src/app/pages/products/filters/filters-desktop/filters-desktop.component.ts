import { Component, effect, inject, signal } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  selectFilters,
  selectProducts,
} from '../../../../data/store/product/product.selectors';
import { FiltersService } from '../../../../data/services/filters.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { filter, take } from 'rxjs';

@Component({
  selector: 'app-filters-desktop',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './filters-desktop.component.html',
  styleUrl: './filters-desktop.component.scss',
})
export class FiltersDesktopComponent {
  store = inject(Store);
  filters = this.store.selectSignal(selectFilters);
  categories = signal<string[]>([]);
  products = this.store.selectSignal(selectProducts);
  filtersService = inject(FiltersService);
  sortControl = new FormControl('');

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
