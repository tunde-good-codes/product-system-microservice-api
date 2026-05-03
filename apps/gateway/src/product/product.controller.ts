import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "apps/product/src/dto/product.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Headers("authorization") authHeader: string
  ) {
    const token = authHeader.startsWith("Bearer ") ? authHeader : `Bearer ${authHeader}`;

    return await this.productService.createProduct(createProductDto, token);
  }

  @Get()
  async getProducts(@Headers("authorization") authToken: string) {
    const formattedToken = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;

    return await this.productService.getAllProduct(formattedToken);
  }
}
