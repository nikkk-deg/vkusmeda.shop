import { Component } from '@angular/core';
import { FiltersDesktopComponent } from './filters-desktop/filters-desktop.component';
import { FiltersMobileComponent } from './filters-mobile/filters-mobile.component';

@Component({
  selector: 'app-filters',
  imports: [FiltersDesktopComponent, FiltersMobileComponent],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent {}
