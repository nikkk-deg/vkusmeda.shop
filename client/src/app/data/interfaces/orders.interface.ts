export interface OrdersInterface {
  createdAt: string;
  _id: string;
  isActive: string;
  email: string;
  __v: number;

  products: {
    productId: {
      _id: string;

      titleEn: string;
      titleRu: string;
      miniCaption: string;
      microCaption: string;
      photos: string[];

      price: number;

      caption: { feature: string; value: string }[];
    };
    jars: number;
    _id: string;
    __v: number;
  }[];
}
