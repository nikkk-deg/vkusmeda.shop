export interface ProductInterface {
  _id: string;
  titleEn: string;
  titleRu: string;
  miniCaption: string;
  microCaption: string;
  photos: string[];
  price: number;
  caption: Feature[];
  __v: number;
}

interface Feature {
  feature: string;
  value: string;
}
