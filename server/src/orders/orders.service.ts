import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Basket } from 'src/schemas/Basket.schema';
import { Order } from 'src/schemas/Order.schema';
import { Product } from 'src/schemas/Product.schema';
import { User } from 'src/schemas/User.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { BasketService } from 'src/basket/basket.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { MailerService } from 'src/mailer/mailer.service';
import { generateOrderEmail } from 'src/mailer/html-templates/order.html';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Basket.name) private basketModel: Model<Basket>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private basketService: BasketService,
    private mailerService: MailerService,
  ) {}

  async cancelOrder(id: mongoose.Schema.Types.ObjectId) {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      {
        isActive: 'cancel',
      },
      { new: true },
    );
    if (!order) throw new HttpException('Order not found', 404);
    return order;
  }

  async getOrderById(id: mongoose.Schema.Types.ObjectId) {
    const order = (await this.orderModel.findById(id)).populate(
      'products.productId',
    );
    if (!order) throw new HttpException('Order not found', 404);
    return order;
  }

  async sendOrderAnEmail(email, products, name) {
    const mailSettings = {
      recipients: [{ name: '', address: email }],
      subject: `Новый заказ Вкус Мёда`,
      html: generateOrderEmail(name, products),
    };
    await this.mailerService.sendEmail(mailSettings);
    return { message: `Email have sended to ${email}` };
  }

  async getUserOrders(payload: LoginDto) {
    const orders = await this.orderModel
      .find({ email: payload.email })
      .populate('products.productId');
    if (!orders.length) throw new HttpException('User not found', 400);
    return orders;
  }
  async createOrder(payload: CreateOrderDto) {
    const productIds = payload.products.map((product) => product.productId);

    const existingProducts = await this.productModel.find(
      { _id: { $in: productIds } },
      { _id: 1, titleRu: 1, price: 1 },
    );

    if (existingProducts.length !== productIds.length) {
      throw new HttpException('Some products do not exist', 400);
    }

    this.addNewUser(payload.email);
    this.removeOrderFromBasket(payload);

    const enrichedProducts = payload.products
      .map((product) => {
        const foundProduct = existingProducts.find(
          (p) => p._id.toString() === product.productId.toString(),
        );
        if (!foundProduct) return null;

        return {
          productId: product.productId,
          titleRu: foundProduct.titleRu,
          price: foundProduct.price,
          jars: product.jars,
        };
      })
      .filter(Boolean);

    const newOrder = await this.orderModel.create({
      ...payload,
      isActive: 'active',
      products: enrichedProducts,
    });

    await newOrder.save();

    const user = await this.userModel.findOne({ email: payload.email });

    const name =
      user.name && user.surname
        ? `${user.name.charAt(0).toUpperCase() + user.name.slice(1)} ${user.surname.charAt(0).toUpperCase() + user.surname.slice(1)}`
        : user.name
          ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
          : user.surname
            ? user.surname.charAt(0).toUpperCase() + user.surname.slice(1)
            : 'покупатель';

    this.sendOrderAnEmail(payload.email, enrichedProducts, name);

    return newOrder;
  }

  async addNewUser(email: string) {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      const newUser = await this.userModel.create({ email: email });
      newUser.save();
    }
  }

  async removeOrderFromBasket(payload: CreateOrderDto) {
    try {
      const user = await this.userModel.findOne({ email: payload.email });
      if (!user) throw new HttpException('User not found', 400);
      const userBasket = await this.basketModel.findById(user._id);
      if (!userBasket) throw new HttpException('Basket not found', 400);
      payload.products.forEach(async (item) => {
        await this.basketService.decreaseProduct({
          //@ts-ignore
          userId: user._id,
          productId: item.productId,
          jars: item.jars,
        });
      });
    } catch (error) {
      console.error(error);
    }
  }
}
