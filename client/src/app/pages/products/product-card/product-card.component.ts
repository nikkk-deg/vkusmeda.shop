import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ProductInterface } from '../../../data/interfaces/product.interface';
import { BasketService } from '../../../data/services/basket.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  router = inject(Router);
  basketService = inject(BasketService);

  //@ts-ignore
  @Input() isInBasket: boolean = false;

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

  navigateTo(_id: string) {
    this.router.navigate([`product/${_id}`]);
  }

  addToBasket(productId: string) {
    this.basketService.addToBasket(productId, 1);
  }
}
