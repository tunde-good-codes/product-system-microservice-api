import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UseGuards
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CurrentUser } from "libs/shared/src/decorators/current-user.decorator";
import { JwtAuthGuard } from "@app/common/guards/jwt.authGuard";
import { CreateProductDto } from "./dto/product.dto";
import { RolesGuard } from "libs/shared/src/guards/role.guard";
import { Roles } from "libs/shared/src/decorators/role.decorator";
import { Role } from "@app/common/enum.types";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  logger = new Logger();
  @Get("hello")
  getHello(): string {
    return this.productService.getHello();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser("id") id: string) {
    try {
      return await this.productService.createProduct(createProductDto, id);
    } catch (error) {
      this.logger.log("USER ID:", id);
      this.logger.log("BODY:", createProductDto);
      throw new BadRequestException(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get(":id")
  async getSingleProduct(@Param("id") id: string) {
    return await this.productService.getSingleProduct(id);
  }
}
