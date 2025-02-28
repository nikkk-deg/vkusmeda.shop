import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { SendEmailDto } from './dto/send-mail.dto';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: true,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendEmail(dto: SendEmailDto) {
    const transport = this.mailTransport();
    const options: Mail.Options = {
      from: {
        name: this.configService.get<string>('APP_NAME'),
        address: this.configService.get<string>('MAIL_USER'),
      },
      to: dto.recipients,
      subject: dto.subject,
      html: dto.html,
    };

    try {
      const result = await transport.sendMail(options);

      return result;
    } catch (err) {
      throw new HttpException(`Email did not sent. Error - ${err}`, 500);
    }
  }
}
