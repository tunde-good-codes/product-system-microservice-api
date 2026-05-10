import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CurrentUser } from "libs/shared/src/decorators/current-user.decorator";
import { JwtAuthGuard } from "@app/common/guards/jwt.authGuard";
import { CreateProductDto } from "./dto/product.dto";
import { RolesGuard } from "libs/shared/src/guards/role.guard";
import { Roles } from "libs/shared/src/decorators/role.decorator";
import { Role } from "@app/common/enum.types";
import { FileInterceptor } from "@nestjs/platform-express";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { KAFKA_TOPICS } from "@app/kafka/constants/kafka.topics";
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
  @UseInterceptors(FileInterceptor("image", { limits: { fileSize: 5 * 1024 * 1024 } }))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser("id") id: string,
    @UploadedFile() file: Express.Multer.File | undefined
  ) {
    try {
      return await this.productService.createProduct(createProductDto, id, file);
    } catch (error) {
      this.logger.error("Create product error", error);
      throw new BadRequestException(error.message);
    }
  }

  @MessagePattern(KAFKA_TOPICS.MEDIA_ATTACHED)
  async handleMediaAttached(
    @Payload() payload: { productId: string; imageUrl: string; mediaId: string }
  ) {
    await this.productService.updateProductImageUrl(
      payload.productId,
      payload.imageUrl,
      payload.mediaId
    );
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
