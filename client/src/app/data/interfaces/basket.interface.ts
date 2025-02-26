import { ProductInterface } from './product.interface';

export interface ProductInterfaceForBasket {
  _id: string;
  titleEn: string;
  titleRu: string;
  miniCaption: string;
  microCaption: string;
  photos: string[];
  price: number;
  caption: Feature[];
  __v: number;
  jars: number;
}

interface Feature {
  feature: string;
  value: string;
}

export interface BasketInterface {
  _id: string;
  __v: number;
  products: ProductInterfaceForBasket[];
}
