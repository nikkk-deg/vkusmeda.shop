import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { ProductInterface } from '../../data/interfaces/product.interface';
import { selectProducts } from '../../data/store/product/product.selectors';
import { AddToBasketComponent } from '../../common-ui/add-to-basket/add-to-basket.component';
import { ProductsService } from '../../data/services/products.service';

@Component({
  selector: 'app-product',
  imports: [RouterLink, AddToBasketComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  productId = signal<string | null>(null);
  productSlug = signal<string | null>(null);
  route = inject(ActivatedRoute);
  titleService = inject(Title);
  store = inject(Store);
  metaService = inject(Meta);
  product = signal<ProductInterface | null>(null);
  productMainPhoto = signal('');
  router = inject(Router);
  productService = inject(ProductsService);

  ngOnInit() {
    this.product.set(this.route.snapshot.data['product']);
    this.productMainPhoto.set(this.product()!.photos[0]);
    this.titleService.setTitle(this.product()!.titleRu);
    this.metaService.addTags([
      {
        name: 'description',
        content: `Продажа натурального ${
          this.product()!.titleRu
        }высокого качества. Свежий, ароматный мёд от проверенных пчеловодов. Доставка по всей России. Лучшие цены!`,
      },
      {
        name: 'keywords',
        content: this.product()!.titleRu,
      },
      { name: 'author', content: 'вкус меда' },
      { name: 'robots', content: 'index, follow' },
    ]);
  }

  changeMainPhoto(photo: string) {
    this.productMainPhoto.set(photo);
  }
}
