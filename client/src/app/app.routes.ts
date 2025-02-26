import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthComponent } from './pages/auth/auth.component';
import { provideState } from '@ngrx/store';
import { authFeature } from './data/store/auth/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './data/store/auth/auth.effects';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ProductsComponent } from './pages/products/products.component';
import { BasketComponent } from './pages/basket/basket.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    providers: [provideState(authFeature), provideEffects(AuthEffects)],
    children: [
      { path: 'auth', component: AuthComponent },
      { path: '', component: MainPageComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'basket', component: BasketComponent },
    ],
  },
];
