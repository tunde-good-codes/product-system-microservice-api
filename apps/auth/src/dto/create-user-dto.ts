import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(60)
  email: string;
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(60)
  password: string;
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(60)
  name: string;

  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  
  @IsOptional()
  role?: Role;


}
