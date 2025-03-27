import {
  Component,
  effect,
  inject,
  PLATFORM_ID,
  Renderer2,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { take } from 'rxjs';
import { FiltersService } from '../../../../data/services/filters.service';
import {
  selectFilters,
  selectProducts,
} from '../../../../data/store/product/product.selectors';
import { isPlatformBrowser } from '@angular/common';

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
  r2 = inject(Renderer2);
  platformId = inject(PLATFORM_ID);

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

  setIsVisible() {
    this.isVisible.set(!this.isVisible());
    if (isPlatformBrowser(this.platformId)) {
      if (this.isVisible()) {
        this.r2.addClass(document.body, 'no-scroll');
      } else {
        this.r2.removeClass(document.body, 'no-scroll');
      }
    }
  }
}
