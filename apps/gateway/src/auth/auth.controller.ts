import { Body, Controller, Get, Headers, Post, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "apps/auth/src/dto/create-user-dto";
import { LoginDto } from "apps/auth/src/dto/login.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.authService.createUser(createUserDto);
  }

  @Post("login")
  async loginUser(@Body() loginDto: LoginDto) {
    return await this.authService.loginUser(loginDto);
  }

  @Get()
  async getHello() {
    return await this.authService.getHello();
  }
@Get("profile")
async getProfile(@Headers("authorization") token: string) {
  const formattedToken = token.startsWith("Bearer ")
    ? token
    : `Bearer ${token}`;

  return await this.authService.getUserProfile(formattedToken);
}
}
