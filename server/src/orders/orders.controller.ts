import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { UserService } from './user.service';
import { RememberUserDto } from './dto/remember-user.dto';
import mongoose from 'mongoose';

@Controller('orders')
export class OrdersController {
  constructor(
    private authService: AuthService,
    private orderService: OrdersService,
    private userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  getUser(@Body() payload: LoginDto) {
    return this.authService.findUser(payload);
  }

  @Post('create')
  createOrder(@Body() payload: CreateOrderDto) {
    return this.orderService.createOrder(payload);
  }

  @Post('rememberUser')
  rememberUser(@Body() payload: RememberUserDto) {
    return this.userService.rememberUser(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('getOrders')
  getOrders(@Body() payload: LoginDto) {
    return this.orderService.getUserOrders(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getOrder/:id')
  getOrderById(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.orderService.getOrderById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('cancelOrder/:id')
  cancelOrder(@Param('id') id: mongoose.Schema.Types.ObjectId) {
    return this.orderService.cancelOrder(id);
  }
}
