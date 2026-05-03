import { Body, Controller, Get, Logger, Param, Post, UseGuards } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CurrentUser } from "libs/shared/src/decorators/current-user.decorator";
import { JwtAuthGuard } from "@app/common/guards/jwt.authGuard";
import { CreateProductDto } from "./dto/product.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  logger = new Logger();
  @Get()
  getHello(): string {
    return this.productService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createProduct(@Body() createProductDto: CreateProductDto, @CurrentUser("id") id: string) {
    try {
      return await this.productService.createProduct(createProductDto, id);
    } catch (error) {
      this.logger.log("USER ID:", id);
      this.logger.log("BODY:", createProductDto);
    throw new (error)
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts() {
    return await this.productService.getAllProducts();
  }

  @Get(":id")
  async getSingleProduct(@Param("id") id: string) {
    await this.productService.getSingleProduct(id);
  }
}
