/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user-dto";
import { LoginDto } from "./dto/login.dto";
import { CurrentUser } from "libs/shared/src/decorators/current-user.decorator";
import { JwtAuthGuard } from "@app/common/guards/jwt.authGuard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.loginUser(loginDto);
  }

  @Get()
  getHello() {
    return this.authService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  async getUserProfile(@CurrentUser("id") userId: string) {
    return await this.authService.getUserProfile(userId);
  }
}
