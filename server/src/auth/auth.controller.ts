import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('auth')
  async sendLoginLink(@Body() payload: LoginDto) {
    return this.authService.sendLoginLink(payload.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async login(@Request() req) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    return this.authService.login(token);
  }

  @Post('create')
  async createUser(@Body() payload: LoginDto) {
    return this.authService.createUser(payload);
  }
}
