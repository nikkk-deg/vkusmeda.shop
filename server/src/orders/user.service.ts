import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { RememberUserDto } from './dto/remember-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async rememberUser(payload: RememberUserDto) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      {
        email: payload.email,
      },
      {
        phoneNumber: payload.phoneNumber,
        name: payload.name,
        surname: payload.surname,
      },
      { new: true },
    );
    if (!updatedUser) throw new HttpException('User not updated', 400);
    return updatedUser;
  }
}
