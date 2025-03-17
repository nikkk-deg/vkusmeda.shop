import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductModule } from './product/product.module';
import { BasketModule } from './basket/basket.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    ProductModule,
    MailerModule,
    BasketModule,
    OrdersModule,
    AuthModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
