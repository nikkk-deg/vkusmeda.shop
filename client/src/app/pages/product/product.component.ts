import { JsonPipe } from '@angular/common';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs';
import { productsActions } from '../../data/store/product/product.actions';
import { selectProducts } from '../../data/store/product/product.selectors';
import { ProductInterface } from '../../data/interfaces/product.interface';

@Component({
  selector: 'app-product',
  imports: [JsonPipe],
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

  constructor() {
    effect(() => {
      this.product.set(
        this.store
          .selectSignal(selectProducts)()
          .filter((item) => item._id === this.productId())[0]
      );
    });
  }

  ngOnInit() {
    this.route.paramMap.pipe(take(1)).subscribe((params) => {
      this.productId.set(params.get('productId'));
      this.productSlug.set(params.get('productSlug'));
    });
  }

  // loadProductDetails() {
  //   this.titleService.setTitle(`Купить ${this.product()?.titleRu} онлайн`);
  //   //@ts-ignore
  //   this.metaService.updateTag({
  //     name: 'description',
  //     content: this.product()?.microCaption,
  //   });
  //   this.metaService.updateTag({
  //     name: 'keywords',
  //     content: product.keywords.join(', '),
  //   });
  // }
}
