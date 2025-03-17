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

  honey = [
    { _id: '679dd483dd24a0f6b7579afe', titleRu: 'Акациевый мёд' },
    { _id: '679dd483dd24a0f6b7579aff', titleRu: 'Клеверный мёд' },
    { _id: '679dd483dd24a0f6b7579b00', titleRu: 'Луговой мёд' },
    { _id: '679dd483dd24a0f6b7579b01', titleRu: 'Гречишный мёд' },
    { _id: '679dd483dd24a0f6b7579b02', titleRu: 'Шалфейный мёд' },
    { _id: '679dd483dd24a0f6b7579b03', titleRu: 'Многоцветковый мёд' },
    { _id: '679dd4f6dd24a0f6b7579b05', titleRu: 'Липовый мёд' },
    { _id: '679dd4f6dd24a0f6b7579b06', titleRu: 'Рапсовый мёд' },
    { _id: '679dd4f6dd24a0f6b7579b07', titleRu: 'Одуванчиковый мёд' },
    { _id: '679dd4f6dd24a0f6b7579b08', titleRu: 'Рододендроновый мёд' },
    { _id: '679dd4f6dd24a0f6b7579b09', titleRu: 'Каштановый мёд' },
    { _id: '679dd4f6dd24a0f6b7579b0a', titleRu: 'Подсолнечный мёд' },
  ];

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
      // this.productSlug.set(params.get('productSlug'));
      this.titleService.setTitle(
        `${
          this.honey.filter((item) => item._id === params.get('productId'))[0]
            .titleRu
        } купить мед`
      );

      this.metaService.updateTag({
        name: 'description',
        content: `${
          this.honey.filter((item) => item._id === params.get('productId'))[0]
            .titleRu
        } - один из самых популярных и полезных видов меда. Узнайте больше о его свойствах и приобретите с доставкой на дом!`,
      });
      this.metaService.updateTag({
        name: 'keywords',
        content: `${
          this.honey.filter((item) => item._id === params.get('productId'))[0]
            .titleRu
        }, натуральный мед, купить мед, мед доставка`,
      });
    });
  }

  changeMainPhoto(photo: string) {
    this.productMainPhoto.set(photo);
  }
}
