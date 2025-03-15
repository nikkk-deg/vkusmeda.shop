import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { loginEmailTemplate } from 'src/mailer/html-templates/login.html';
import { MailerService } from 'src/mailer/mailer.service';
import { User } from 'src/schemas/User.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailerService: MailerService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async login(token: string) {
    const payload = this.jwtService.verify(token);
    const user = await this.userModel.findOne({ email: payload.email });
    if (user) {
      return user;
    } else {
      return this.createUser({ email: payload.email });
    }
  }

  async sendLoginLink(email: string) {
    try {
      const user = this.findUser({ email: email });
      if (!user) this.createUser({ email: email });

      const resetToken = this.jwtService.sign(
        { email: email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      );

      const mailSettings = {
        recipients: [{ name: '', address: email }],
        subject: `Вход в личный кабинет Вкус Мёда`,
        html: loginEmailTemplate(
          `${this.configService.get<string>('LOGIN_LINK')}${resetToken}`,
        ),
      };
      await this.mailerService.sendEmail(mailSettings);
      return { message: `Email have sended to ${email}` };
    } catch (error) {
      throw new HttpException(`Can not send email - error ${error}`, 500);
    }
  }

  async createUser(payload: LoginDto) {
    const user = await this.userModel.create(payload);
    return user.save();
  }

  async findUser(payload: LoginDto) {
    const user = await this.userModel.findOne({ email: payload.email });
    if (!user) throw new HttpException('User not found', 400);
    return user;
  }
}
