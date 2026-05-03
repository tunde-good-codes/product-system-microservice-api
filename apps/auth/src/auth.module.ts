import { PassportModule } from "@nestjs/passport";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { KafkaModule } from "@app/kafka";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/users.entity";
import { DatabaseModule } from "@app/database";
import { JwtStrategy } from "./jwtStrategy";
import { RefreshTokenStrategy } from "./refresh-token.strategy";
import { Product } from "apps/product/src/entity/product.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env"
    }),
    KafkaModule.register("auth-service-group"),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Product]),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>("JWT_SECRET") ?? "jsonwebtoken",
        signOptions: {
          expiresIn: configService.getOrThrow("JWT_EXPIRES_IN")
        }
      })
    }),
    PassportModule.register({
      defaultStrategy: "jwt"
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshTokenStrategy],
  exports: [AuthService]
})
export class AuthModule {}
