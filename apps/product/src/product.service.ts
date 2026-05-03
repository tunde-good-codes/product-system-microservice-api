import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
  Req
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { KAFKA_SERVICE } from "@app/kafka";
import { ClientKafka } from "@nestjs/microservices";
import { CreateProductDto } from "./dto/product.dto";
import { Repository } from "typeorm";
import { User } from "apps/auth/src/entities/users.entity";
import { KAFKA_TOPICS } from "@app/kafka/constants/kafka.topics";
import { AuthService } from "apps/auth/src/auth.service";

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,

    private readonly authService: AuthService,

    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async createProduct(createProductDto: CreateProductDto, userId: string) {
    try {
      const user = await this.authService.getOneUserById(userId);

      if (!user) {
        throw new NotFoundException("user no found");
      }

      // if (
      //   createProductDto.price < 0 ||
      //   typeof createProductDto.price !== "number" ||
      //   Number.isNaN(createProductDto.price)
      // ) {
      //   throw new BadRequestException("number must not be less than 0");
      // }

      const newProduct = this.productRepository.create({
        ...createProductDto,
        user: user.user
      });

      await this.productRepository.save(newProduct);
      this.kafkaClient.emit(KAFKA_TOPICS.PRODUCT_CREATED, {
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price
      });

      return {
        success: true,
        product: newProduct
      };
    } catch (e) {
      throw new BadRequestException("Internal server error");
    }
  }

  async getAllProducts() {
    const products = await this.productRepository.find({});

    if (!products) {
      throw new BadRequestException("cant fetch product");
    }

    return {
      success: true,
      products
    };
  }

  async getSingleProduct(id: string) {
    const product = await this.productRepository.findOne({
      where: { id }
    });

    if (!product) {
      throw new NotFoundException("can't find product with this id");
    }

    return {
      success: true,
      product
    };
  }
}
