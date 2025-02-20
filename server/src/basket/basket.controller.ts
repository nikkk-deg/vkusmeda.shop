import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { BasketService } from './basket.service';
import { RemoveFromBasketDto } from './dto/remove-from-basket.dto';
import { ChangeBasketJarsDto } from './dto/change-basket.dto';

@Controller('basket')
export class BasketController {
  constructor(private basketService: BasketService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  addToBasket(@Body() payload: ChangeBasketJarsDto) {
    return this.basketService.addToBasket(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getBasket(@Param('id') id: string) {
    return this.basketService.getBasket(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('remove')
  deleteFromBasket(@Body() payload: RemoveFromBasketDto) {
    return this.basketService.removeFromBasket(payload);
  }

  @UseGuards(JwtAuthGuard)
  @Post('decrease')
  decreaseFromBasket(@Body() payload: ChangeBasketJarsDto) {
    return this.basketService.decreaseProduct(payload);
  }
}
