import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException
} from "@nestjs/common";
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
  async getUsers(@Headers("authorization") token: string) {
    let formattedToken;
    if (token) {
      formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    } else {
      throw new BadRequestException("no token to this header");
    }
    return await this.authService.getUsers(formattedToken);
  }
  @Get("profile")
  async getProfile(@Headers("authorization") token: string) {
    let formattedToken;
    if (token) {
      formattedToken = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    } else {
      throw new BadRequestException("no token to this header");
    }
    return await this.authService.getUserProfile(formattedToken);
  }
}
