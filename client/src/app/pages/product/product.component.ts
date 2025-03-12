import { JsonPipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { ProductInterface } from '../../data/interfaces/product.interface';
import { selectProducts } from '../../data/store/product/product.selectors';
import { AddToBasketComponent } from '../../common-ui/add-to-basket/add-to-basket.component';

@Component({
  selector: 'app-product',
  imports: [RouterLink, AddToBasketComponent, JsonPipe],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  productId = signal<string | null>(null);
  productSlug = signal<string | null>(null);
  route = inject(ActivatedRoute);
  titleService = inject(Title);
  store = inject(Store);
  metaService = inject(Meta);
  product = signal<ProductInterface | null>(null);
  productMainPhoto = signal('');
  router = inject(Router);

  constructor() {
    effect(() => {
      this.product.set(
        this.store
          .selectSignal(selectProducts)()
          .filter((item) => item._id === this.productId())[0]
      );
      if (!this.product()) {
        this.router.navigate(['/error']);
      }
    });

    effect(() => {
      this.productMainPhoto.set(this.product()!.photos[0]);
    });
  }

  ngOnInit() {
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.productId.set(params.get('productId'));
      this.productSlug.set(params.get('productSlug'));
    });
  }

  changeMainPhoto(photo: string) {
    this.productMainPhoto.set(photo);
  }
}
