import { Component, inject, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { authActions } from '../../data/store/auth/auth.actions';
import {
  selectBasket,
  selectEmailLoading,
  selectUser,
  selectUserError,
  selectUserLoading,
} from '../../data/store/auth/auth.selectors';
import { productsActions } from '../../data/store/product/product.actions';
import { selectProductsLoading } from '../../data/store/product/product.selectors';
import { FiltersService } from '../../data/services/filters.service';

@Component({
  selector: 'app-layout',
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements OnInit {
  cookieService = inject(CookieService);
  store = inject(Store);
  loadingEmail = this.store.selectSignal(selectEmailLoading);
  loadingUser = this.store.selectSignal(selectUserLoading);
  isErrorUser = this.store.selectSignal(selectUserError);
  basket = this.store.selectSignal(selectBasket);
  user = this.store.selectSignal(selectUser);
  loadingProducts = this.store.selectSignal(selectProductsLoading);
  filtersService = inject(FiltersService);

  ngOnInit() {
    this.filtersService.getFiltersFromSSAndDispatch();

    const token = this.cookieService.get('token');
    this.store.dispatch(authActions.getUser({ token }));
    //@ts-ignore
    this.store.dispatch(authActions.getBasket({ userId: this.user()?._id }));
    this.store.dispatch(productsActions.getProducts());
  }
}
