import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "enter a valid email" })
  @IsNotEmpty({ message: "email should not be null" })
  email: string;

  @IsNotEmpty({ message: "password should not be null" })
  @MinLength(3, { message: "password must has min 3 character" })
  @MaxLength(50, { message: " password must have max 50 characters" })
  password: string;

  
}
