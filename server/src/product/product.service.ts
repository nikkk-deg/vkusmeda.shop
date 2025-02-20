import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from 'src/schemas/Product.schema';
import { CreateProductDto } from './dtos/create-products';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async getAllProducts() {
    const products = await this.productModel.find();
    if (!products) throw new HttpException('DB error', 500);
    return products;
  }

  async getProductById(id: Types.ObjectId) {
    const product = await this.productModel.findById(id);
    if (!product) throw new HttpException('DB error', 500);
    return product;
  }

  async createMany(products: CreateProductDto[]): Promise<Product[]> {
    return this.productModel.insertMany(products);
  }
}
