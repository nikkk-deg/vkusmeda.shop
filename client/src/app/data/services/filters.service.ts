import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectFilters } from '../store/product/product.selectors';
import { productsActions } from '../store/product/product.actions';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  store = inject(Store);
  filters = this.store.selectSignal(selectFilters);

  changeSelectAndDispatch(select: 'popular' | 'price-up' | 'price-down') {
    if (typeof window !== 'undefined' && sessionStorage) {
      //@ts-ignore
      const filters = JSON.parse(sessionStorage.getItem('filters'));
      filters.sortBy = select;
      sessionStorage.setItem('filters', JSON.stringify(filters));
      this.store.dispatch(productsActions.setFilters({ filters: filters }));
    }
  }

  changeCategoryAndDispatch(category: string) {
    if (typeof window !== 'undefined' && sessionStorage) {
      //@ts-ignore
      let filters = JSON.parse(sessionStorage.getItem('filters'));
      const index = filters.selected.findIndex((item: string) => {
        return item === category;
      });
      if (index > -1) {
        const newFilters = filters.selected.filter(
          (item: string) => item !== category
        );
        filters.selected = newFilters;
      } else {
        filters.selected.push(category);
      }

      sessionStorage.setItem('filters', JSON.stringify(filters));
      this.store.dispatch(productsActions.setFilters({ filters: filters }));
    }
  }

  getFiltersFromSSAndDispatch() {
    if (typeof window !== 'undefined' && sessionStorage) {
      const filters = sessionStorage.getItem('filters');
      if (!filters) {
        const newFilters = {
          sortBy: 'popular',
          selected: [],
        };

        sessionStorage.setItem('filters', JSON.stringify(newFilters));
        //@ts-ignore
        this.store.dispatch(
          productsActions.setFilters({ filters: newFilters })
        );
        return;
      }
      const filtersForStore = JSON.parse(filters);

      this.store.dispatch(
        productsActions.setFilters({ filters: filtersForStore })
      );
    }
    return;
  }

  resetFilters() {
    const newFilters = {
      sortBy: 'popular',
      selected: [],
    };
    if (typeof window !== 'undefined' && sessionStorage) {
      sessionStorage.setItem('filters', JSON.stringify(newFilters));
      this.store.dispatch(productsActions.setFilters({ filters: newFilters }));
    }
  }
}
