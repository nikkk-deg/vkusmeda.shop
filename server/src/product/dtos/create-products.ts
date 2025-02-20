import { IsString, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CaptionDto {
  @IsString()
  feature: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  titleEn: string;

  @IsString()
  titleRu: string;

  @IsString()
  miniCaption: string;

  @IsString()
  microCaption: string;

  @IsArray()
  @IsString({ each: true })
  photos: string[];

  @IsNumber()
  price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CaptionDto)
  caption: CaptionDto[];
}
