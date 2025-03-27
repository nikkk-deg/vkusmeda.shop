import { Component, HostListener, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductInterface } from '../../../data/interfaces/product.interface';
import { BasketService } from '../../../data/services/basket.service';
import { Store } from '@ngrx/store';
import { authActions } from '../../../data/store/auth/auth.actions';
import { selectUser } from '../../../data/store/auth/auth.selectors';
import { AddToBasketComponent } from '../../../common-ui/add-to-basket/add-to-basket.component';

@Component({
  selector: 'app-product-card',
  imports: [AddToBasketComponent, RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  router = inject(Router);
  basketService = inject(BasketService);
  store = inject(Store);
  user = this.store.selectSignal(selectUser);
  imagePath: string = '';

  @Input() product: ProductInterface = {
    _id: '',
    titleEn: '',
    titleRu: '',
    miniCaption: '',
    microCaption: '',
    photos: [],
    price: 0,
    caption: [],
    __v: 0,
  };

  ngOnInit() {
    const size = window.innerWidth < 461 ? '300px' : '222px';
    this.imagePath =
      `/assets/images/honey/${size}/` +
      this.product.photos[0].slice(0, -3) +
      'webp';
  }

  navigateTo(_id: string) {
    this.router.navigate([`product/${_id}`]);
  }
}
