import { Body, Controller, ForbiddenException, Get, Headers, Param, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "apps/product/src/dto/product.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Headers("authorization") authToken: string
  ) {
    let token;
    if (authToken) {
      token = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;
    } else {
      throw new ForbiddenException("auth token missing");
    }

    return await this.productService.createProduct(createProductDto, token);
  }

  @Get()
  async getProducts(@Headers("authorization") authToken: string) {
    let formattedToken;
    if (authToken) {
      formattedToken = authToken.startsWith("Bearer ") ? authToken : `Bearer ${authToken}`;
    } else {
      throw new ForbiddenException("auth token missing");
    }

    return await this.productService.getAllProduct(formattedToken);
  }

  @Get(":id")
  async getSingleUser(@Param("id") productId: string) {
    return await this.productService.getSingleProduct(productId);
  }
}
