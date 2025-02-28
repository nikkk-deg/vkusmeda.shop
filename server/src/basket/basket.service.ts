import { Product } from './../schemas/Product.schema';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Basket } from 'src/schemas/Basket.schema';
import mongoose from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { RemoveFromBasketDto } from './dto/remove-from-basket.dto';
import { ChangeBasketJarsDto } from './dto/change-basket.dto';
import { SyncBasketDto } from './dto/sync-basket.dto';

@Injectable()
export class BasketService {
  constructor(
    @InjectModel(Basket.name) private basketModel: Model<Basket>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getBasket(userId: string) {
    const basket = await this.basketModel
      .findById(userId)
      .populate('products.productId');
    if (!basket) {
      throw new HttpException('Basket not found in DB', 400);
    }
    return basket;
  }

  async removeFromBasket(payload: RemoveFromBasketDto) {
    const updatedBasket = await this.basketModel.findByIdAndUpdate(
      payload.userId,
      { $pull: { products: { productId: payload.productId } } },
      { new: true },
    );

    if (!updatedBasket) {
      throw new HttpException('Basket not found in DB', 400);
    }

    return updatedBasket;
  }

  async decreaseProduct(payload: ChangeBasketJarsDto) {
    try {
      const basket = await this.basketModel.findById(payload.userId);
      if (!basket) {
        throw new HttpException('Basket not found in DB', 400);
      }

      const product = basket.products.find(
        (item) => item.productId == payload.productId,
      );

      if (!product) {
        throw new HttpException('Product not found in basket', 400);
      }

      if (product.jars - payload.jars <= 0) {
        await this.basketModel.findByIdAndUpdate(
          payload.userId,
          { $pull: { products: { productId: payload.productId } } },
          { new: true },
        );
      } else {
        await this.basketModel.findOneAndUpdate(
          { _id: payload.userId, 'products.productId': payload.productId },
          { $inc: { 'products.$.jars': -payload.jars } },
          { new: true },
        );
      }

      return { message: 'Product quantity updated' };
    } catch (error) {
      return { msg: error };
    }
  }

  async createBasketIfNotExists(userId: mongoose.Schema.Types.ObjectId) {
    try {
      return await this.basketModel.findOneAndUpdate(
        { _id: userId },
        { $setOnInsert: { products: [] } },
        { upsert: true, new: true },
      );
    } catch (error) {
      throw new Error(`Ошибка при создании корзины: ${error.message}`);
    }
  }

  async increaseProductQuantity(
    userId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    jars: number,
  ) {
    try {
      return await this.basketModel.findOneAndUpdate(
        { _id: userId, 'products.productId': productId },
        { $inc: { 'products.$.jars': jars } },
        { new: true },
      );
    } catch (error) {
      throw new Error(
        `Ошибка при обновлении количества товара: ${error.message}`,
      );
    }
  }

  async addNewProductToBasket(
    userId: mongoose.Schema.Types.ObjectId,
    productId: mongoose.Schema.Types.ObjectId,
    jars: number,
  ) {
    try {
      return await this.basketModel.findOneAndUpdate(
        { _id: userId },
        { $push: { products: { productId, jars } } },
        { new: true },
      );
    } catch (error) {
      throw new Error(`Ошибка при добавлении нового товара: ${error.message}`);
    }
  }

  async addToBasket(payload: ChangeBasketJarsDto) {
    try {
      const isUserValid = await this.checkIsValidUser(payload.userId);

      const isProductValid = await this.checkIsValidProduct(payload.productId);

      if (!isUserValid) {
        throw new HttpException('User not found in DB', 400);
      }

      if (!isProductValid) {
        throw new HttpException('Product not found in DB', 400);
      }

      const userBasket = await this.createBasketIfNotExists(payload.userId);
      if (!userBasket) throw new Error('Корзина не была создана');

      const updatedBasket = await this.increaseProductQuantity(
        payload.userId,
        payload.productId,
        payload.jars,
      );

      if (!updatedBasket) {
        const newBasket = await this.addNewProductToBasket(
          payload.userId,
          payload.productId,
          payload.jars,
        );
        if (!newBasket)
          throw new Error('Ошибка при добавлении товара в корзину');
      }

      return { success: true };
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkIsValidProduct(productId: mongoose.Schema.Types.ObjectId) {
    const product = await this.productModel.findById(productId);
    if (!product) return false;
    return true;
  }

  async checkIsValidUser(userId: mongoose.Schema.Types.ObjectId) {
    const user = await this.userModel.findById(userId);
    if (!user) return false;
    return true;
  }

  async syncBasketWithLogin(payload: SyncBasketDto) {
    let basket = await this.basketModel.findOne({ _id: payload.userId });

    if (!basket) {
      await this.createBasketIfNotExists(payload.userId);
    }

    basket = await this.basketModel.findOne({ _id: payload.userId });

    payload.products.forEach((product) => {
      const productIndex = basket.products.findIndex((item) => {
        //@ts-ignore
        return item.productId.toString() === product.productId;
      });
      if (productIndex > -1) {
        basket.products[productIndex].jars += product.jars;
      } else {
        basket.products.push(product);
      }
    });
    await basket.save();
    return this.getBasket(payload.userId.toString());
  }
}
