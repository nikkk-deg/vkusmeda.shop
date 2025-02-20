import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class RememberUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  name: string;

  @IsOptional()
  surname: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;
}
