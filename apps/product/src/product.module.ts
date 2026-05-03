import { Module } from "@nestjs/common";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entity/product.entity";
import { KafkaModule } from "@app/kafka";
import { DatabaseModule } from "@app/database";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "apps/auth/src/auth.module";
import { User } from "apps/auth/src/entities/users.entity";
import { JwtStrategy } from "apps/auth/src/jwtStrategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, User]), 
    KafkaModule.register("product-service-group"),
    DatabaseModule,

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    })
  ],
  controllers: [ProductController],
  providers: [ProductService,JwtStrategy]
})
export class ProductModule {}
