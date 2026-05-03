import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength
} from "class-validator";
import { ProductStatus } from "../entity/product.entity";
import { Type } from 'class-transformer';

export class CreateProductDto {

  @IsOptional()
  @MinLength(3)
  @MaxLength(600)
  description: string;


  @IsNotEmpty()
  @Min(0)
  @IsNumber()
  @Type(() => Number)

  price: number;

  @MinLength(3)
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  status?: ProductStatus;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class GetProductByIdDto {
  @IsString()
  id: string;
}

export type ProductDataContext = {
  id?:string
  description: string;
  name: string;
  price: number;
  imageUrl?:string;
  status?:ProductStatus
};
