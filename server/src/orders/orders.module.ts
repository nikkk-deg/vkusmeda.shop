import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Basket, BasketSchema } from 'src/schemas/Basket.schema';
import { Product, ProductSchema } from 'src/schemas/Product.schema';
import { User, UserSchema } from 'src/schemas/User.schema';
import { Order, OrderSchema } from 'src/schemas/Order.schema';
import { BasketModule } from 'src/basket/basket.module';
import { UserService } from './user.service';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Basket.name,
        schema: BasketSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Order.name,
        schema: OrderSchema,
      },
    ]),
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    BasketModule,
    MailerModule,
  ],
  providers: [OrdersService, UserService],
  controllers: [OrdersController],
})
export class OrdersModule {}
