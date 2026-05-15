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
import { KAFKA_TOPICS } from "@app/kafka/constants/kafka.topics";
import { User } from "apps/auth/src/entities/users.entity";

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,

    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,

    @Inject(KAFKA_SERVICE) private readonly kafkaClient: ClientKafka
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.MEDIA_ATTACHED);

    await this.kafkaClient.connect();
  }

  async createProduct(
    createProductDto: CreateProductDto,
    userId: string,
    file?: Express.Multer.File
  ) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException("User not found");

      const newProduct = this.productRepository.create({
        ...createProductDto,
        user
      });
      await this.productRepository.save(newProduct);

      // Emit with image data attached so media service can upload
      this.kafkaClient.emit(KAFKA_TOPICS.PRODUCT_CREATED, {
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        userId,
        ...(file && {
          imageBase64: file.buffer.toString("base64"),
          imageMimetype: file.mimetype,
          imageFilename: file.originalname,
          uploadedByUserId: userId
        })
      });

      return { success: true, product: newProduct };
    } catch (e) {
      throw e; // don't swallow the original error
    }
  }

  // product.service.ts — add this method
  async updateProductImageUrl(productId: string, imageUrl: string, mediaId:string) {
    await this.productRepository.update(productId, { imageUrl, mediaId });
  }
  async getAllProducts() {
    const products = await this.productRepository.find({
      order: {
        createdAt: "ASC"
      }
    });

    if (!products || !products.length) {
      throw new BadRequestException("cant fetch product");
    }

    return {
      success: true,
      products,
      totalProduct: products.length
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
