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
import { ProductFeature } from './data/store/product/product.reducer';
import { ProductEffects } from './data/store/product/product.effects';
import { ProductComponent } from './pages/product/product.component';
import { OrderFeature } from './data/store/order/order.reducer';
import { OrderEffects } from './data/store/order/order.effects';
import { AboutComponent } from './pages/about/about.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { MakeOrderComponent } from './pages/make-order/make-order.component';
import { OrderComponent } from './pages/order/order.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { ProductResolver } from './data/services/product.resolver';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    providers: [
      provideState(authFeature),
      provideEffects(AuthEffects),
      provideState(ProductFeature),
      provideEffects(ProductEffects),
      provideState(OrderFeature),
      provideEffects(OrderEffects),
    ],
    children: [
      { path: 'auth', component: AuthComponent },
      { path: '', component: MainPageComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'basket', component: BasketComponent },
      // { path: 'make-order', component: MakeOrderComponent },
      { path: 'about', component: AboutComponent },
      { path: 'orders', component: OrdersComponent },
      {
        path: 'product/:productId',
        component: ProductComponent,
        resolve: { product: ProductResolver },
      },
      { path: 'order/:orderId', component: OrderComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
];
