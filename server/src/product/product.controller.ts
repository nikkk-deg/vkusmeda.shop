import { Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Types } from 'mongoose';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: Types.ObjectId) {
    return this.productService.getProductById(id);
  }
}
